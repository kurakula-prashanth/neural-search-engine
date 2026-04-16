"""
FastAPI application entry point for the Semantic & Hybrid Search Engine.

On startup the app:
  1. Loads and preprocesses the TechQA dataset
  2. Builds the BM25 index
  3. Loads the Sentence Transformer model & builds the FAISS index
  4. Initialises the Hybrid engine
"""

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.data_loader import load_and_preprocess
from app.engines.bm25_engine import BM25Engine
from app.engines.semantic_engine import SemanticEngine
from app.engines.hybrid_engine import HybridEngine
from app.routes.search import router as search_router, init_routes, set_ready


async def initialize_engines():
    """Heavy background task to load AI models and data."""
    print("=" * 60)
    print("Background Initialization Started...")
    print("=" * 60)

    try:
        # 1 ── Load data (Offload to thread)
        df = await asyncio.to_thread(load_and_preprocess)

        # 2 ── Build BM25 index (Offload to thread)
        bm25_engine = BM25Engine()
        await asyncio.to_thread(bm25_engine.build_index, df)

        # 3 ── Build Semantic index (Offload to thread)
        semantic_engine = SemanticEngine()
        await asyncio.to_thread(semantic_engine.build_index, df)

        # 4 ── Create Hybrid engine
        hybrid_engine = HybridEngine(bm25_engine, semantic_engine)

        # 5 ── Inject into routes
        init_routes(df, bm25_engine, semantic_engine, hybrid_engine)
        
        # 6 ── Mark as ready
        set_ready(True)

        print("=" * 60)
        print("All engines initialised — server is ready!")
        print("=" * 60)
    except Exception as e:
        print(f"CRITICAL ERROR during initialization: {str(e)}")



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # Start the heavy engine initialization in the background
    # This allows the server to open its port IMMEIDATELY
    asyncio.create_task(initialize_engines())
    
    yield  # ← app runs here

    print("Shutting down…")


# ── Create the FastAPI app ───────────────────────────────────────────────────
app = FastAPI(
    title="Semantic & Hybrid Search Engine",
    description=(
        "AI-powered search engine for Technical Q&A. "
        "Supports BM25 keyword search, Sentence Transformer semantic search, "
        "and a weighted hybrid approach."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routes ──────────────────────────────────────────────────────────
app.include_router(search_router)

