"""
Data loader & preprocessor for the TechQA dataset.

Responsibilities:
  • Read the multiline CSV
  • Drop rows with missing / placeholder answers
  • Normalize text for BM25 tokenisation
  • Return a clean pandas DataFrame
"""

import re
import pandas as pd
from app.config import DATA_PATH


def _clean_text(text: str) -> str:
    """Basic text normalisation: collapse whitespace, strip."""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def load_and_preprocess() -> pd.DataFrame:
    """
    Load techqa.csv and return a cleaned DataFrame with columns:
        question       – original question text (cleaned)
        answer         – original answer text (cleaned)
        question_lower – lowered question for BM25 tokenisation
    """
    df = pd.read_csv(DATA_PATH, encoding="utf-8")

    # Ensure expected columns exist
    assert "question" in df.columns and "answer" in df.columns, (
        f"Expected 'question' and 'answer' columns, got {list(df.columns)}"
    )

    # Drop rows where question or answer is missing
    df = df.dropna(subset=["question", "answer"])

    # Remove rows with placeholder answers ("-")
    df = df[df["answer"].str.strip() != "-"]

    # Clean text
    df["question"] = df["question"].apply(_clean_text)
    df["answer"] = df["answer"].apply(_clean_text)

    # Lower-cased question for BM25 tokenisation
    df["question_lower"] = df["question"].str.lower()

    # Reset index for positional lookups
    df = df.reset_index(drop=True)

    print(f"[DataLoader] Loaded {len(df)} Q&A pairs after preprocessing.")
    return df
