from fastapi import FastAPI, UploadFile, File
from app.ml.isolation import detect_anomalies
import shutil
import os
import pandas as pd

app = FastAPI(title="Anomaly Detection Dashboard")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "API Running"}


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = pd.read_csv(filepath)

    numeric_cols = df.select_dtypes(include=["number"]).columns

    if len(numeric_cols) == 0:
        return {"error": "No numeric columns found"}

    column = "value"

    predictions = detect_anomalies(df[[column]])

    df["prediction"] = predictions

    anomalies = df[df["prediction"] == -1]

    return {
        "filename": file.filename,
        "rows": len(df),
        "column_used": column,
        "anomalies_found": len(anomalies),
        "anomalies": anomalies.to_dict(orient="records")
    }