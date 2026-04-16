# Use Python 3.10 slim for a smaller footprint
FROM python:3.10-slim

# Create a non-root user (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:${PATH}"

WORKDIR /home/user/app

# Install system dependencies
USER root
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
USER user

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire project
COPY --chown=user . .

# Hugging Face Spaces uses port 7860 by default
EXPOSE 7860

# We need to tell Python where the 'app' module is relative to 'main.py'
ENV PYTHONPATH="${PYTHONPATH}:/home/user/app/backend"

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
