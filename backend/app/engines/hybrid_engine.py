"""
Hybrid search engine — combines BM25 and Semantic search scores.

Uses min-max normalisation on each score set, then linearly combines them:
    hybrid_score = alpha * semantic_score + (1 - alpha) * bm25_score

alpha = 1.0  →  pure semantic
alpha = 0.0  →  pure BM25
alpha = 0.5  →  equal weight (default)
"""

from typing import List, Tuple, Dict
from app.engines.bm25_engine import BM25Engine
from app.engines.semantic_engine import SemanticEngine


def _min_max_normalise(scores: Dict[int, float]) -> Dict[int, float]:
    """Normalise scores to [0, 1] range."""
    if not scores:
        return scores
    values = list(scores.values())
    lo, hi = min(values), max(values)
    rng = hi - lo
    if rng == 0:
        return {k: 1.0 for k in scores}
    return {k: (v - lo) / rng for k, v in scores.items()}


class HybridEngine:
    """Weighted fusion of BM25 + Semantic search."""

    def __init__(self, bm25_engine: BM25Engine, semantic_engine: SemanticEngine):
        self._bm25 = bm25_engine
        self._semantic = semantic_engine

    def search(
        self,
        query: str,
        top_k: int = 5,
        alpha: float = 0.5,
    ) -> List[Tuple[int, float]]:
        """
        Perform hybrid search.

        Args:
            query: User search string.
            top_k: Number of top results to return.
            alpha: Weight for semantic score (1 - alpha for BM25).

        Returns:
            List of (doc_index, hybrid_score) tuples, sorted descending.
        """
        # Fetch more candidates from each engine to improve fusion quality
        candidate_k = min(top_k * 4, 50)

        # Get results from both engines
        bm25_results = self._bm25.search(query, candidate_k)
        semantic_results = self._semantic.search(query, candidate_k)

        # Convert to dicts
        bm25_scores = {idx: score for idx, score in bm25_results}
        semantic_scores = {idx: score for idx, score in semantic_results}

        # Normalise
        bm25_norm = _min_max_normalise(bm25_scores)
        semantic_norm = _min_max_normalise(semantic_scores)

        # Merge — union of all candidate document indices
        all_indices = set(bm25_norm.keys()) | set(semantic_norm.keys())
        hybrid_scores: Dict[int, float] = {}

        for idx in all_indices:
            s_sem = semantic_norm.get(idx, 0.0)
            s_bm25 = bm25_norm.get(idx, 0.0)
            hybrid_scores[idx] = alpha * s_sem + (1 - alpha) * s_bm25

        # Sort descending and return top_k
        ranked = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)
        return ranked[:top_k]
