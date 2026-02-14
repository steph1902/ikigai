FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for Playwright and general build tools
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements (if we had a requirements.txt, but we'll inline for now or use pip)
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir \
    scrapy \
    scrapy-playwright \
    psycopg2-binary \
    sqlalchemy \
    pydantic \
    python-dotenv

# Install Playwright browsers (chromium only to save space/time)
RUN playwright install --with-deps chromium

# Set Python path
ENV PYTHONPATH=/app

# Default command (can be overridden by docker-compose)
CMD ["scrapy", "crawl", "suumo"]
