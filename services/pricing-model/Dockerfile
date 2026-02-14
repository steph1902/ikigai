FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (libgomp1 needed for LightGBM)
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Train model during build (for simplicity in this prototype)
RUN python train.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
