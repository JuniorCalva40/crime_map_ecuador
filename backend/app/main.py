from fastapi import FastAPI
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Crime Map Ecuador API",
    description="API para visualización de datos de criminalidad en Ecuador",
    version="1.0.0"
)


frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")


allowed_origins = []


if frontend_url:
    urls = [url.strip() for url in frontend_url.split(',')]
    allowed_origins.extend(urls)

# for dev
allowed_origins.extend([
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
])


allowed_origins.extend([
    "https://www.mapacrimenecuador.info",
    "https://mapacrimenecuador.info",  
])


allowed_origins.extend([
    "https://crime-map-ecuador.vercel.app",
    "https://crime-map-ecuador-7f8tn3ywf-juniorcalva40s-projects.vercel.app",
])

# Config CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Crime Map Ecuador API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "crime_data": "/crime-data",
            "location_details": "/crime-data/details-by-location",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
