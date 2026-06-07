import io
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from app.ml.isolation_forest import detect_anomalies

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "running"}

@app.post("/upload")
async def upload(file: UploadFile):
    contents = await file.read()

    df = pd.read_csv(io.BytesIO(contents))

    result = detect_anomalies(df)

    return {
        "filename": file.filename,   # ✅ FIX HERE
        "rows": result["rows"],
        "anomalies_found": result["anomalies_found"],
        "anomalies": result["anomalies"]
    }