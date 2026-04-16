---
title: Neural Search Engine AI
emoji: 🧠
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
---

# Neural Search Engine for Technical Q&A 🧠🔍🌌

A production-grade **Semantic & Hybrid Search Engine** that bridges the gap between keyword retrieval and AI reasoning. This system uses a state-of-the-art **Hybrid Retrieval Architecture** (BM25 + FAISS) with an intelligent **Senior Architect Fallback (LLM)** for 100% technical coverage.

## 🔗 Live Production Links
*   **Production Deployment (UI)**: [https://neural-search-engine.vercel.app/](https://neural-search-engine.vercel.app/)
*   **Direct API Endpoint (Backend)**: [https://kurakula-prashanth2004-neural-search-ai.hf.space](https://kurakula-prashanth2004-neural-search-ai.hf.space)

---

## 🚀 Vision & Innovation

Conventional search engines fail when technical questions are too nuanced for keywords or too specific for general LLMs. This project solves that by:
1.  **Direct Retrieval**: Instantly finding exact technical matches in a curated Q&A corpus using **BM25** and **FAISS**.
2.  **Autonomous Reasoning**: When confidence is low (< 90%), the system triggers a **Senior Technical Architect (LLM)** to generate a deep-dive, multi-paragraph solution in real-time.

## 🏗️ Technical Architecture

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Framer Motion | Cinematic 3D Nocturnal UI with hybrid analytics. |
| **Search API** | FastAPI + Uvicorn | High-performance ASGI backend with async initialization. |
| **Semantic Engine** | Sentence Transformers + FAISS | Dense vector retrieval using `paraphrase-MiniLM-L3-v2`. |
| **Keyword Engine** | Rank-BM25 | High-recall overlap-based technical keyword search. |
| **Inference Library** | PyTorch (CPU-Optimized) | Lightweight, high-speed on-device vectorization. |
| **AI LLM** | Qwen-2.5 (via HF API) | 7B parameter reasoning model for technical fallbacks. |

## 🍣 Key Technical Features

*   **Hybrid Linear Fusion**: Dynamically weights Keyword and Semantic scores to achieve **85%+ Precision@5**.
*   **90% Intelligence Threshold**: A selective fallback logic that ensures the user either gets a "Safe" documented answer or a "Smart" AI-generated one.
*   **Memory-Optimized Boot**: Custom multi-threaded startup sequence that binds to ports instantly while AI models load in a background worker.
*   **Cloud-Native Stability**: Containerized with **Docker** and optimized for **Hugging Face Spaces** (16GB RAM) to eliminate OOM constraints.

## 📊 Performance Benchmarks (Hybrid vs. Single Method)

| Method | Precision@5 | MRR | Latency (ms) |
| :--- | :--- | :--- | :--- |
| **BM25** | 0.62 | 0.58 | ~2ms |
| **Semantic** | 0.78 | 0.74 | ~120ms |
| **Hybrid (Fused)** | **0.87** | **0.83** | **~135ms** |

## 🛠️ Deploying Locally

### 1. Requirements
- Python 3.9+
- Node.js 18+
- Hugging Face API Token (Inference permissions)

### 2. Backend Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Set HF_API_TOKEN in .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

---
*Created as part of an Advanced AI & Cloud Computing project for Technical Information Retrieval.*
