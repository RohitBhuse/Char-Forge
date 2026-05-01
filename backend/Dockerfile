FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove gcc

# We don't copy the app here yet since we use volume mounting in docker-compose for dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
