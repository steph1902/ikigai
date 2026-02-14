import httpx
import os

TIMEOUT = 30.0

PRICING_SERVICE_URL = os.getenv("PRICING_SERVICE_URL", "http://pricing-model:8002")
DOCUMENT_SERVICE_URL = os.getenv("DOCUMENT_SERVICE_URL", "http://document-ocr:8003")
VR_SERVICE_URL = os.getenv("VR_SERVICE_URL", "http://vr-engine:8004")
EMBEDDING_SERVICE_URL = os.getenv("EMBEDDING_SERVICE_URL", "http://embedding:8001")

async def call_service(service_url: str, endpoint: str, method: str = "GET", data: dict = None, files: dict = None):
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        url = f"{service_url}{endpoint}"
        if method == "GET":
            response = await client.get(url, params=data)
        elif method == "POST":
            response = await client.post(url, json=data, files=files)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response.raise_for_status()
        return response.json()
