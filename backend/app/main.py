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

# Obtener URL del frontend desde variables de entorno
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Permitir múltiples orígenes para desarrollo y producción
allowed_origins = [frontend_url]

# Si estamos en desarrollo, agregar localhost
if "localhost" not in frontend_url:
    allowed_origins.append("http://localhost:5173")
    allowed_origins.append("http://localhost:3000")

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
