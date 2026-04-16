"""
Pydantic models (schemas) for API request / response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


# ── Individual search result ─────────────────────────────────────────────────
class SearchResult(BaseModel):
    """A single ranked search result."""
    rank: int = Field(..., description="1-based rank of this result")
    question: str = Field(..., description="Matched question from the dataset")
    answer: str = Field(..., description="Corresponding answer")
    score: Optional[float] = Field(None, description="Relevance score or None if LLM generated")
    source: str = Field("retrieval", description="Origin: 'retrieval' or 'llm_fallback'")


# ── Search response ──────────────────────────────────────────────────────────
class SearchResponse(BaseModel):
    """Response from any single search endpoint."""
    query: str
    method: str = Field(..., description="Search method used: bm25 | semantic | hybrid")
    top_k: int
    results: List[SearchResult]
    time_ms: float = Field(..., description="Search latency in milliseconds")
    total_documents: int


# ── Evaluation metrics ───────────────────────────────────────────────────────
class Metrics(BaseModel):
    """Evaluation metrics for a search method."""
    precision_at_k: float
    recall_at_k: float
    mrr: float


# ── Comparison response ──────────────────────────────────────────────────────
class MethodResult(BaseModel):
    """Single method's results + metrics for comparison."""
    method: str
    results: List[SearchResult]
    time_ms: float
    metrics: Metrics


class CompareResponse(BaseModel):
    """Side-by-side comparison of all three search methods."""
    query: str
    top_k: int
    total_documents: int
    methods: List[MethodResult]


# ── Health ───────────────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str = "ok"
    total_documents: int
    index_built: bool
