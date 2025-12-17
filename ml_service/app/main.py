from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.ml_utils import predict_risk
from app.pdf_utils import extract_text_from_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_text")
async def analyze_text(data: dict):
    raw = predict_risk(data.get("text", ""))

    return {
        "label": raw.get("primary_emotion", "").upper(),
        "suicidal_score": float(raw.get("suicidal_signal", 0.0)),
        "support_recommended": raw.get("support_recommended", False),
        "message": raw.get("message"),
        "confidence_level": raw.get("confidence_level"),
        "status": raw.get("status")
    }

@app.post("/analyze_pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    path = f"uploaded_pdfs/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(path)
    raw = predict_risk(text)

    return {
        "label": raw.get("primary_emotion", "").upper(),
        "suicidal_score": float(raw.get("suicidal_signal", 0.0)),
        "support_recommended": raw.get("support_recommended", False),
        "message": raw.get("message"),
        "confidence_level": raw.get("confidence_level"),
        "status": raw.get("status")
    }
