"""
BM25 (Best Matching 25) keyword search engine.

Uses the Okapi BM25 ranking function to score documents by
term frequency / inverse document frequency.
"""

from typing import List, Tuple
from rank_bm25 import BM25Okapi
import pandas as pd


class BM25Engine:
    """BM25 keyword-based search engine."""

    def __init__(self):
        self._bm25: BM25Okapi | None = None
        self._df: pd.DataFrame | None = None

    def build_index(self, df: pd.DataFrame) -> None:
        """
        Build the BM25 index from the preprocessed DataFrame.

        Args:
            df: DataFrame with a 'question_lower' column for tokenised text.
        """
        self._df = df
        # Tokenise by whitespace
        tokenised_corpus = [q.split() for q in df["question_lower"].tolist()]
        self._bm25 = BM25Okapi(tokenised_corpus)
        print(f"[BM25Engine] Index built with {len(tokenised_corpus)} documents.")

    def search(self, query: str, top_k: int = 5) -> List[Tuple[int, float]]:
        """
        Search the corpus for the query.

        Args:
            query: User search string.
            top_k: Number of top results to return.

        Returns:
            List of (doc_index, bm25_score) tuples, sorted descending by score.
        """
        if self._bm25 is None:
            raise RuntimeError("BM25 index has not been built yet.")

        tokenised_query = query.lower().split()
        scores = self._bm25.get_scores(tokenised_query)

        # Get top-k indices
        top_indices = scores.argsort()[::-1][:top_k]
        return [(int(idx), float(scores[idx])) for idx in top_indices]
