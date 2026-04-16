"""
Evaluation metrics for comparing search methods.

Metrics implemented:
  • Precision@K — fraction of retrieved results that are relevant
  • Recall@K   — fraction of relevant results that are retrieved
  • MRR        — Mean Reciprocal Rank (1 / rank of first relevant result)

Since we don't have labelled relevance judgments for every query, we use
a *proxy* approach: the semantic search results serve as the "ground truth"
relevant set, and we measure how well BM25 / hybrid recover those results.
Alternatively when using /search/compare, we compute approximate metrics by
treating the top-1 result from the best-performing method as relevant.
"""

from typing import List, Set


def precision_at_k(retrieved_ids: List[int], relevant_ids: Set[int], k: int) -> float:
    """
    Precision@K: Of the top-k retrieved documents, how many are relevant?

    Args:
        retrieved_ids: Ordered list of document indices returned by the search.
        relevant_ids:  Set of document indices considered relevant.
        k:             Cut-off rank.

    Returns:
        Precision value in [0.0, 1.0].
    """
    if k == 0:
        return 0.0
    top_k = retrieved_ids[:k]
    relevant_in_top_k = sum(1 for doc_id in top_k if doc_id in relevant_ids)
    return relevant_in_top_k / k


def recall_at_k(retrieved_ids: List[int], relevant_ids: Set[int], k: int) -> float:
    """
    Recall@K: Of all relevant documents, how many appear in the top-k?

    Args:
        retrieved_ids: Ordered list of document indices returned by the search.
        relevant_ids:  Set of document indices considered relevant.
        k:             Cut-off rank.

    Returns:
        Recall value in [0.0, 1.0].
    """
    if not relevant_ids:
        return 0.0
    top_k = retrieved_ids[:k]
    relevant_in_top_k = sum(1 for doc_id in top_k if doc_id in relevant_ids)
    return relevant_in_top_k / len(relevant_ids)


def mrr(retrieved_ids: List[int], relevant_ids: Set[int]) -> float:
    """
    Mean Reciprocal Rank: 1 / position of the first relevant result.

    Args:
        retrieved_ids: Ordered list of document indices returned by the search.
        relevant_ids:  Set of document indices considered relevant.

    Returns:
        MRR value in [0.0, 1.0].
    """
    for rank, doc_id in enumerate(retrieved_ids, start=1):
        if doc_id in relevant_ids:
            return 1.0 / rank
    return 0.0


def compute_metrics(
    retrieved_ids: List[int],
    relevant_ids: Set[int],
    k: int,
) -> dict:
    """Compute all metrics at once and return as a dict."""
    return {
        "precision_at_k": round(precision_at_k(retrieved_ids, relevant_ids, k), 4),
        "recall_at_k": round(recall_at_k(retrieved_ids, relevant_ids, k), 4),
        "mrr": round(mrr(retrieved_ids, relevant_ids), 4),
    }
