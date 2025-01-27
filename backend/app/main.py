from fastapi import FastAPI
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Config CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
