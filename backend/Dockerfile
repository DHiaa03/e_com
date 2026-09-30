FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for compiling psycopg2 and general utils
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install pydantic[email]

# Copy source code
COPY . /app/

# Ensure static uploads directories exist
RUN mkdir -p /app/static/uploads/avatars /app/static/uploads/products

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
