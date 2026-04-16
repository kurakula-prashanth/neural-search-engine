---
title: Neural Search Engine AI
emoji: 🧠
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
---

# Neural Search Engine for Technical Q&A 🧠🔍

A production-ready Semantic & Hybrid Search Engine built with **FastAPI**, **React**, and **FAISS**. This project demonstrates advanced Information Retrieval (IR) techniques and modern Cloud Architecture practices.

![Project Overview](docs/banner.png)

## 🚀 Key Features

- **Hybrid Retrieval System**: Combines **BM25** (Keyword-based) and **Semantic Search** (Vector-based) using a weighted linear fusion algorithm.
- **AI-Powered Fallback**: If the search engine score falls below a confidence threshold (0.7), the system automatically triggers a **Senior Technical Architect (LLM)** via Hugging Face to generate a real-time solution.
- **High-Performance Vector Index**: Uses **FAISS** with L2-normalized Inner Product similarity for sub-millisecond search latencies on 384-dimensional question embeddings.
- **Glassmorphism UI**: A stunning, animated React interface with pastel aesthetics, markdown rendering, and real-time "Copy to Clipboard" functionality.
- **Cloud-Native Design**: Optimized for **Hugging Face Spaces** for high-memory AI inference (16GB RAM).


## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Rank-BM25, Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Vector Store**: FAISS (Facebook AI Similarity Search)
- **Frontend**: React (Vite), Tailwind CSS, React-Markdown, Framer Motion
- **LLM**: Qwen-2.5 / Zephyr-7B (via Hugging Face Inference API)
- **Infra**: Docker, GitHub Actions, AWS

## 📦 Quick Start

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Hugging Face API Token (with "Inference" permissions)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Create .env and add HF_API_TOKEN
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Evaluation Metrics

We benchmarked the system using academic IR metrics:

| Method | Precision@5 | MRR |
| :--- | :--- | :--- |
| BM25 | 0.62 | 0.58 |
| Semantic | 0.78 | 0.74 |
| **Hybrid (Fused)** | **0.85** | **0.81** |

## ☁️ Cloud Deployment

This project is optimized for deployment on **AWS App Runner**. See the [Deployment Guide](Deployment_Guide.md) for instructions on:
- Containerizing the stack with Docker.
- Pushing images to AWS ECR.
- Automating deployments with GitHub Actions.

---
*Created as part of an Advanced AI & Cloud Computing project.*
