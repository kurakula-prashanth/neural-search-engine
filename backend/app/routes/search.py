"""
API routes for the search endpoints.

Endpoints:
  GET /search/bm25      — BM25 keyword search
  GET /search/semantic   — Semantic (embedding + FAISS) search
  GET /search/hybrid     — Hybrid (BM25 + semantic) search
  GET /search/compare    — Side-by-side comparison with metrics
  GET /health            — Health check
"""

import time
from typing import List, Set
from fastapi import APIRouter, Query

from app.models import (
    SearchResult,
    SearchResponse,
    CompareResponse,
    MethodResult,
    Metrics,
    HealthResponse,
)
from app.engines.evaluation import compute_metrics
from app.llm_client import ask_huggingface_llm
from app.config import FALLBACK_THRESHOLD

router = APIRouter()

# ── These will be injected at startup from main.py ───────────────────────────
_df = None
_bm25_engine = None
_semantic_engine = None
_hybrid_engine = None
_is_ready = False


def init_routes(df, bm25_engine, semantic_engine, hybrid_engine):
    """Called once during app startup to inject shared state."""
    global _df, _bm25_engine, _semantic_engine, _hybrid_engine
    _df = df
    _bm25_engine = bm25_engine
    _semantic_engine = semantic_engine
    _hybrid_engine = hybrid_engine


def set_ready(ready: bool):
    """Update system readiness state."""
    global _is_ready
    _is_ready = ready


def check_readiness():
    """Raise 503 if system is not yet initialized."""
    if not _is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The Neural Engine is currently initializing AI models. Please try again in 30 seconds."
        )



def _results_from_indices(
    indices_scores: list,
) -> List[SearchResult]:
    """Convert (index, score) tuples → SearchResult objects."""
    results = []
    for rank, (idx, score) in enumerate(indices_scores, start=1):
        results.append(
            SearchResult(
                rank=rank,
                question=_df.iloc[idx]["question"],
                answer=_df.iloc[idx]["answer"],
                score=round(score, 4),
            )
        )
    return results


# ── Health ───────────────────────────────────────────────────────────────────
@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        total_documents=len(_df) if _df is not None else 0,
        index_built=_bm25_engine is not None,
    )


# ── BM25 Search ─────────────────────────────────────────────────────────────
@router.get("/search/bm25", response_model=SearchResponse)
async def search_bm25(
    query: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(5, ge=1, le=20, description="Number of results"),
):
    check_readiness()
    start = time.perf_counter()
    indices_scores = _bm25_engine.search(query, top_k)
    elapsed = (time.perf_counter() - start) * 1000

    return SearchResponse(
        query=query,
        method="bm25",
        top_k=top_k,
        results=_results_from_indices(indices_scores),
        time_ms=round(elapsed, 2),
        total_documents=len(_df),
    )


# ── Semantic Search ──────────────────────────────────────────────────────────
@router.get("/search/semantic", response_model=SearchResponse)
async def search_semantic(
    query: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(5, ge=1, le=20, description="Number of results"),
):
    check_readiness()
    start = time.perf_counter()
    indices_scores = _semantic_engine.search(query, top_k)
    elapsed = (time.perf_counter() - start) * 1000

    return SearchResponse(
        query=query,
        method="semantic",
        top_k=top_k,
        results=_results_from_indices(indices_scores),
        time_ms=round(elapsed, 2),
        total_documents=len(_df),
    )


# ── Hybrid Search ────────────────────────────────────────────────────────────
@router.get("/search/hybrid", response_model=SearchResponse)
async def search_hybrid(
    query: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(5, ge=1, le=20, description="Number of results"),
    alpha: float = Query(0.5, ge=0.0, le=1.0, description="Semantic weight"),
):
    check_readiness()
    start = time.perf_counter()
    indices_scores = _hybrid_engine.search(query, top_k, alpha)
    elapsed = (time.perf_counter() - start) * 1000

    results = []
    
    # Check if the highest score from retrieval meets the fallback threshold
    if indices_scores and indices_scores[0][1] >= FALLBACK_THRESHOLD:
        # Standard retrieval - return top matches
        for rank, (idx, score) in enumerate(indices_scores, start=1):
            results.append(
                SearchResult(
                    rank=rank,
                    question=_df.iloc[idx]["question"],
                    answer=_df.iloc[idx]["answer"],
                    score=round(score, 4),
                    source="retrieval"
                )
            )
    else:
        # Top score is too low; fallback to generating an answer using the LLM API
        llm_response = ask_huggingface_llm(query)
        
        results.append(
            SearchResult(
                rank=1,
                question="AI Powered Fallback Response",
                answer=llm_response["answer"],
                score=None,
                source=llm_response["source"]
            )
        )


    return SearchResponse(
        query=query,
        method="hybrid",
        top_k=top_k,
        results=results,
        time_ms=round(elapsed, 2),
        total_documents=len(_df),
    )


# ── Compare All Methods ─────────────────────────────────────────────────────
@router.get("/search/compare", response_model=CompareResponse)
async def search_compare(
    query: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(5, ge=1, le=20, description="Number of results"),
):
    check_readiness()
    """
    Run all three search methods and compare with evaluation metrics.

    We use the semantic search top-k results as the "ground truth" relevant set
    (proxy), then measure how well BM25 and hybrid recover those results.
    """
    # Run all three
    start_bm25 = time.perf_counter()
    bm25_results = _bm25_engine.search(query, top_k)
    time_bm25 = (time.perf_counter() - start_bm25) * 1000

    start_sem = time.perf_counter()
    semantic_results = _semantic_engine.search(query, top_k)
    time_sem = (time.perf_counter() - start_sem) * 1000

    start_hyb = time.perf_counter()
    hybrid_results = _hybrid_engine.search(query, top_k)
    time_hyb = (time.perf_counter() - start_hyb) * 1000

    # Ground truth: union of top results from all methods 
    # Use semantic results as primary reference
    semantic_ids: Set[int] = {idx for idx, _ in semantic_results}

    bm25_ids = [idx for idx, _ in bm25_results]
    sem_ids = [idx for idx, _ in semantic_results]
    hyb_ids = [idx for idx, _ in hybrid_results]

    bm25_metrics = compute_metrics(bm25_ids, semantic_ids, top_k)
    sem_metrics = compute_metrics(sem_ids, semantic_ids, top_k)
    hyb_metrics = compute_metrics(hyb_ids, semantic_ids, top_k)

    methods = [
        MethodResult(
            method="bm25",
            results=_results_from_indices(bm25_results),
            time_ms=round(time_bm25, 2),
            metrics=Metrics(**bm25_metrics),
        ),
        MethodResult(
            method="semantic",
            results=_results_from_indices(semantic_results),
            time_ms=round(time_sem, 2),
            metrics=Metrics(**sem_metrics),
        ),
        MethodResult(
            method="hybrid",
            results=_results_from_indices(hybrid_results),
            time_ms=round(time_hyb, 2),
            metrics=Metrics(**hyb_metrics),
        ),
    ]

    return CompareResponse(
        query=query,
        top_k=top_k,
        total_documents=len(_df),
        methods=methods,
    )
