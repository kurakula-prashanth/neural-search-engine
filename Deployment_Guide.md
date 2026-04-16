# AWS Deployment Guide 🚀☁️

To showcase your **Cloud Computing & DevOps skills**, we will deploy this system using a **Containerized Workflow** on **AWS App Runner**.

## 🏗️ The Cloud Architecture
- **Engine**: AWS App Runner (Serverless Container Orchestration)
- **Registry**: Amazon ECR (Elastic Container Registry)
- **Database**: S3 or local persistent storage (Internal to container for this project)
- **CI/CD**: GitHub Actions

---

## 🛠️ Step 1: Push to GitHub
Before cloud deployment, your code must be on GitHub.

1. Create a new repository on GitHub named `neural-search-engine`.
2. Run these commands:
   ```bash
   git add .
   git commit -m "feat: implement neural dark design and cloud-native setup"
   git remote add origin https://github.com/YOUR_USERNAME/neural-search-engine.git
   git push -u origin main
   ```

---

## 🐳 Step 2: Docker Verification (Local)
Ensure everything works in containers:
```bash
docker-compose up --build
```
*Access frontend at `http://localhost`.*

---

## ☁️ Step 3: Deploying to AWS App Runner

### 1. Create ECR Repositories
Go to AWS Console -> ECR -> Create Repositories:
- `neural-search-backend`
- `neural-search-frontend`

### 2. Push Images to ECR
Follow the "View push commands" in the AWS ECR console. It will look like this:
```bash
# Login
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Build & Push Backend
docker build -t neural-search-backend ./backend
docker tag neural-search-backend:latest your-account-id.dkr.ecr.your-region.amazonaws.com/neural-search-backend:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/neural-search-backend:latest

# Build & Push Frontend (IMPORTANT: Pass Backend URL)
docker build -t neural-search-frontend --build-arg VITE_API_BASE=YOUR_BACKEND_APP_RUNNER_URL ./frontend
docker tag neural-search-frontend:latest your-account-id.dkr.ecr.your-region.amazonaws.com/neural-search-frontend:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/neural-search-frontend:latest
```

### 3. Create App Runner Services
1. **Backend Service**:
   - Source: Amazon ECR
   - Image: `neural-search-backend`
   - Port: `8000`
   - Environment Variables: Add `HF_API_TOKEN`
2. **Frontend Service**:
   - Source: Amazon ECR
   - Image: `neural-search-frontend`
   - Port: `80`

---

## ⚡ Step 4: Automating with GitHub Actions (Optional)
To really impress, we can add a `.github/workflows/deploy.yml` file. This tells AWS to **auto-redeploy** every time you push code to GitHub.

Would you like me to generate that CI/CD configuration for you next?
