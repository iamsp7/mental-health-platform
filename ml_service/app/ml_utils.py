# import os
# import joblib
# import numpy as np
# from sentence_transformers import SentenceTransformer
# from transformers import pipeline

# # ================= PATHS =================

# BASE = os.path.dirname(os.path.abspath(__file__))
# MODEL_DIR = os.path.join(BASE, "..", "models")

# # ================= LOAD MODELS (ONCE) =================

# # Mental health multiclass (distress type)
# MC = joblib.load(os.path.join(MODEL_DIR, "risk_multiclass_sample.joblib"))
# mc_model = MC["model"]
# label_encoder = MC["label_encoder"]

# # Suicide risk binary model
# BIN = joblib.load(os.path.join(MODEL_DIR, "risk_suicidal_sample.joblib"))
# bin_model = BIN["model"]

# # Sentence embeddings
# embedder = SentenceTransformer(
#     "sentence-transformers/all-MiniLM-L6-v2"
# )

# # 🔑 Dedicated sentiment model (THIS FIXES YOUR BUG)
# sentiment_model = pipeline(
#     "sentiment-analysis",
#     model="distilbert-base-uncased-finetuned-sst-2-english"
# )

# # ================= CORE FUNCTION =================

# def predict_risk(text: str):
#     text = (text or "").strip()

#     if not text:
#         return {
#             "status": "stable",
#             "primary_emotion": "neutral",
#             "confidence_level": "low",
#             "suicidal_signal": 0.0,
#             "message": "Empty input received.",
#             "support_recommended": False
#         }

#     # ---------- 1️⃣ SENTIMENT (POLARITY) ----------
#     sent = sentiment_model(text)[0]
#     polarity = sent["label"]          # POSITIVE / NEGATIVE
#     polarity_conf = float(sent["score"])

#     # ---------- 2️⃣ EMBEDDING ----------
#     emb = embedder.encode([text], convert_to_numpy=True)

#     # ---------- 3️⃣ DISTRESS CLASSIFICATION ----------
#     probs = mc_model.predict_proba(emb)[0]
#     top_conf = float(np.max(probs))

#     # ---------- 4️⃣ INTENSITY (FROM CONFIDENCE) ----------
#     if top_conf < 0.55:
#         intensity = "LOW"
#     elif top_conf < 0.75:
#         intensity = "MEDIUM"
#     else:
#         intensity = "HIGH"

#     # ---------- 5️⃣ SUICIDE RISK (SEPARATE) ----------
#     suicidal_prob = float(bin_model.predict_proba(emb)[0][1])
#     suicidal = suicidal_prob >= 0.65

#     # ---------- 6️⃣ FINAL DECISION LOGIC ----------
#     if suicidal:
#         final_label = "SUICIDAL"
#         status = "high_risk"
#         support = True

#     elif polarity == "POSITIVE" and intensity == "HIGH":
#         final_label = "EUPHORIC"
#         status = "stable"
#         support = False

#     elif polarity == "POSITIVE":
#         final_label = "POSITIVE"
#         status = "stable"
#         support = False

#     elif polarity == "NEGATIVE" and intensity == "LOW":
#         final_label = "NEUTRAL"
#         status = "stable"
#         support = False

#     else:
#         final_label = "DEPRESSION"
#         status = "emotional_distress"
#         support = True

#     # ---------- 7️⃣ RESPONSE ----------
#     return {
#         "status": status,
#         "primary_emotion": final_label.lower(),
#         "confidence_level": intensity.lower(),
#         "suicidal_signal": round(suicidal_prob, 3),
#         "message": (
#             "High suicide risk detected. Immediate support is recommended."
#             if suicidal else
#             "Emotional state classified using sentiment, intensity, and risk analysis."
#         ),
#         "support_recommended": support
#     }
import os
import joblib
import numpy as np
from transformers import pipeline
from sentence_transformers import SentenceTransformer

# ================= PATHS =================

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "..", "models")

# ================= LOAD MODELS =================

# Suicide risk binary model
BIN = joblib.load(os.path.join(MODEL_DIR, "risk_suicidal_sample.joblib"))
bin_model = BIN["model"]

# Sentence embeddings
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Emotion classification model
emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None,
    device=-1
)

# ================= CONTEXT FILTERS =================

PHYSICAL_FATIGUE_TERMS = {
    "tired",
    "sleepy",
    "exhausted",
    "after walking",
    "after running",
    "after work",
    "after workout",
    "after exercise",
    "physically tired"
}

CALM_POSITIVE_TERMS = {
    "calm",
    "relaxed",
    "peaceful",
    "content",
    "at ease",
    "comfortable"
}

def is_physical_fatigue(text: str) -> bool:
    t = text.lower()
    return any(term in t for term in PHYSICAL_FATIGUE_TERMS)

def is_calm_positive(text: str) -> bool:
    t = text.lower()
    return any(term in t for term in CALM_POSITIVE_TERMS)

# ================= CORE FUNCTION =================

def predict_risk(text: str):
    text = (text or "").strip()

    if not text:
        return {
            "status": "stable",
            "primary_emotion": "neutral",
            "confidence_level": "low",
            "suicidal_signal": 0.0,
            "message": "Empty input received.",
            "support_recommended": False
        }

    # ---------- 1️⃣ EMOTION ----------
    emotions = emotion_model(text)[0]
    top_emotion = max(emotions, key=lambda x: x["score"])
    emotion_label = top_emotion["label"]
    emotion_score = float(top_emotion["score"])

    # ---------- 2️⃣ SUICIDE RISK ----------
    emb = embedder.encode([text], convert_to_numpy=True)
    suicidal_prob = float(bin_model.predict_proba(emb)[0][1])
    suicidal = suicidal_prob >= 0.65

    # ---------- 3️⃣ FINAL DECISION ----------
    if suicidal:
        final_label = "SUICIDAL"
        status = "high_risk"
        support = True

    elif emotion_label == "joy":
        if emotion_score >= 0.75 and not is_calm_positive(text):
            final_label = "EUPHORIC"
        else:
            final_label = "POSITIVE"
        status = "stable"
        support = False

    elif emotion_label == "neutral":
        final_label = "NEUTRAL"
        status = "stable"
        support = False

    elif emotion_label == "sadness":
        if emotion_score >= 0.60 and not is_physical_fatigue(text):
            final_label = "DEPRESSION"
            status = "emotional_distress"
            support = True
        else:
            final_label = "NEUTRAL"
            status = "stable"
            support = False

    elif emotion_label in {"fear", "anger"}:
        final_label = "ANXIETY"
        status = "emotional_distress"
        support = True

    else:
        final_label = "NEUTRAL"
        status = "stable"
        support = False

    # ---------- 4️⃣ RESPONSE ----------
    return {
        "status": status,
        "primary_emotion": final_label.lower(),
        "confidence_level": "high" if emotion_score >= 0.75 else "moderate",
        "suicidal_signal": round(suicidal_prob, 3),
        "message": "Emotion classified using emotion-aware and context-aware analysis.",
        "support_recommended": support
    }
