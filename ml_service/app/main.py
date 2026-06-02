# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from app.ml_utils import predict_risk
# from app.pdf_utils import extract_text_from_pdf
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# class Message(BaseModel):
#     role: str
#     content: str

# class ChatRequest(BaseModel):
#     messages: List[Message]
# @app.post("/chat")
# async def chat(request: ChatRequest):
#     messages = [{"role": m.role, "content": m.content} for m in request.messages]

#     response = client.chat.completions.create(
#         model="llama3-70b-8192",
#         messages=[{"role": "system", "content": SYSTEM_PROMPT}, *messages],
#         temperature=0.7,
#         max_tokens=1024,
#     )

#     return {
#         "reply": response.choices[0].message.content,
#         "model": response.model,
#     }

# @app.post("/analyze_text")
# async def analyze_text(data: dict):
#     raw = predict_risk(data.get("text", ""))

#     return {
#         "label": raw.get("primary_emotion", "").upper(),
#         "suicidal_score": float(raw.get("suicidal_signal", 0.0)),
#         "support_recommended": raw.get("support_recommended", False),
#         "message": raw.get("message"),
#         "confidence_level": raw.get("confidence_level"),
#         "status": raw.get("status")
#     }

# @app.post("/analyze_pdf")
# async def analyze_pdf(file: UploadFile = File(...)):
#     path = f"uploaded_pdfs/{file.filename}"
#     with open(path, "wb") as f:
#         f.write(await file.read())

#     text = extract_text_from_pdf(path)
#     raw = predict_risk(text)

#     return {
#         "label": raw.get("primary_emotion", "").upper(),
#         "suicidal_score": float(raw.get("suicidal_signal", 0.0)),
#         "support_recommended": raw.get("support_recommended", False),
#         "message": raw.get("message"),
#         "confidence_level": raw.get("confidence_level"),
#         "status": raw.get("status")
#    }

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os

from app.ml_utils import predict_risk
from app.pdf_utils import extract_text_from_pdf
from app.groq_client import client, SYSTEM_PROMPT

app = FastAPI()

# Create upload folder if not exists
os.makedirs("uploaded_pdfs", exist_ok=True)

# CORS
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

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

# Chat API
@app.post("/chat")
async def chat(request: ChatRequest):

    messages = [
        {"role": m.role, "content": m.content}
        for m in request.messages
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *messages
        ],
        temperature=0.7,
        max_tokens=1024,
    )

    return {
        "reply": response.choices[0].message.content,
        "model": response.model,
    }

# Analyze Text
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

# Analyze PDF
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