# Cloud Launch Guide: Render & Vercel 🚀☁️

Congratulations! Your **Neural Search AI** is committed and ready for the world. Follow these steps to deploy your multi-service architecture.

## 1. Push to GitHub 🐙
First, you need to create a repository on GitHub and push your code.

1. Go to [GitHub](https://github.com/new) and create a repository named `neural-search-engine`.
2. Run these commands in your terminal:
   ```bash
   git remote add origin https://github.com/kurakula-prashanth/neural-search-engine.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Deploy Backend (Render) 🏗️
Render will host your FastAPI search engine.

1. Log in to [Render.com](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `neural-search-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 1 -k uvicorn.workers.UvicornWorker app.main:app`
5. Click **Advanced** > **Add Environment Variable**:
   - `HF_API_TOKEN`: *(Paste your Hugging Face Token here)*
6. Click **Create Web Service**.

> [!IMPORTANT]
> Once deployed, copy your Render URL (e.g., `https://neural-search-backend.onrender.com`). You will need it for the next step.

---

## 3. Deploy Frontend (Vercel) ⚡
Vercel will host your cinematic 3D React application.

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your `neural-search-engine` repository.
4. Set the following configurations:
   - **Root Directory**: Select `frontend`.
   - **Framework Preset**: `Vite`.
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE`
   - **Value**: *(Paste your Render Backend URL here)*
6. Click **Deploy**.

---

## 🏁 Final Verification
1. Open your Vercel URL.
2. Watch the **Cinematic Intro** load! (3 seconds).
3. Perform a search (e.g., *"How to fix OutOfMemory errors?"*).
4. Verify that the results appear and the 3D particles are moving smoothly.

**Your project is now live! Show it off on your LinkedIn or add it to your Resume.** 🌑🚀✨
