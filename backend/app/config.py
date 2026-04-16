"""
Centralized configuration for the Semantic Search Engine.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent           # backend/
DATA_PATH = BASE_DIR / "techqa.csv"


# ── Model ────────────────────────────────────────────────────────────────────
EMBEDDING_MODEL_NAME = "paraphrase-MiniLM-L3-v2"

EMBEDDING_DIMENSION = 384                                     # output dim of MiniLM

# ── Search defaults ──────────────────────────────────────────────────────────
DEFAULT_TOP_K = 5
MAX_TOP_K = 20
HYBRID_ALPHA = 0.5          # 0 = pure BM25, 1 = pure semantic

# ── LLM Fallback (Hugging Face) ──────────────────────────────────────────────
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "") # Make sure to set this in your .env file
HF_MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"
FALLBACK_THRESHOLD = 0.90    # Extreme confidence required (90%+) for local results




# ── Server ───────────────────────────────────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
CORS_ORIGINS = ["*"]        # allow all origins during dev
