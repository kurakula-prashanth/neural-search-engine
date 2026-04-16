"""
Semantic search engine using Sentence Transformers + FAISS.

Converts questions into dense vectors, stores them in a FAISS index,
and retrieves the most similar documents by cosine similarity.
"""

import gc
import torch
from typing import List, Tuple
import numpy as np
import faiss
import pandas as pd
from sentence_transformers import SentenceTransformer

from app.config import EMBEDDING_MODEL_NAME, EMBEDDING_DIMENSION

# Set torch to single-threaded mode to save memory on low-resource environments
torch.set_num_threads(1)



class SemanticEngine:
    """Dense vector search using Sentence Transformers and FAISS."""

    def __init__(self):
        self._model: SentenceTransformer | None = None
        self._index: faiss.IndexFlatIP | None = None
        self._df: pd.DataFrame | None = None

    def build_index(self, df: pd.DataFrame) -> None:
        """
        Encode all questions and build a FAISS inner-product index.

        We L2-normalise all vectors so that inner product == cosine similarity.

        Args:
            df: Preprocessed DataFrame with a 'question' column.
        """
        self._df = df

        # Load the embedding model
        print(f"[SemanticEngine] Loading model '{EMBEDDING_MODEL_NAME}'...")
        self._model = SentenceTransformer(EMBEDDING_MODEL_NAME)

        # Encode all questions
        questions = df["question"].tolist()
        print(f"[SemanticEngine] Encoding {len(questions)} questions...")
        embeddings = self._model.encode(
            questions,
            show_progress_bar=True,
            batch_size=128,
            normalize_embeddings=True,      # L2-normalise → cosine sim via IP
        )
        embeddings = np.array(embeddings, dtype="float32")

        self._index = faiss.IndexFlatIP(EMBEDDING_DIMENSION)
        self._index.add(embeddings)

        print(f"[SemanticEngine] FAISS index built with {self._index.ntotal} vectors.")
        
        # Clear large temporary embedding arrays from memory
        del embeddings
        gc.collect()


    def search(self, query: str, top_k: int = 5) -> List[Tuple[int, float]]:
        """
        Search the FAISS index for the most semantically similar questions.

        Args:
            query: User search string.
            top_k: Number of top results to return.

        Returns:
            List of (doc_index, cosine_similarity_score) tuples, sorted descending.
        """
        if self._model is None or self._index is None:
            raise RuntimeError("Semantic index has not been built yet.")

        # Encode query - use no_grad to save memory
        with torch.no_grad():
            query_vec = self._model.encode(
                [query],
                normalize_embeddings=True,
            ).astype("float32")

        # Search FAISS
        scores, indices = self._index.search(query_vec, top_k)

        # Immediate cleanup
        del query_vec
        gc.collect()

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1:  # FAISS returns -1 for unfilled slots
                results.append((int(idx), float(score)))

        return results

