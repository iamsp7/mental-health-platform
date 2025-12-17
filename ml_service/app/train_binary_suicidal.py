import os, argparse, joblib
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def train(csv_path, out):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["text", "label"])

    # suicidal = 1, everything else = 0
    df["y"] = df["label"].apply(lambda x: 1 if x.lower() == "suicidal" else 0)

    texts = df["text"].astype(str).tolist()
    y = df["y"].values

    embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    X = embedder.encode(texts, show_progress_bar=True, convert_to_numpy=True)

    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    clf = LogisticRegression(max_iter=2000, class_weight="balanced")
    clf.fit(Xtr, ytr)

    print(classification_report(yte, clf.predict(Xte)))

    joblib.dump(
        {
            "model": clf,
            "embedder_name": "sentence-transformers/all-MiniLM-L6-v2"
        },
        os.path.join(MODEL_DIR, out)
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True)
    parser.add_argument("--out", default="risk_suicidal_sample.joblib")
    args = parser.parse_args()

    train(args.csv, args.out)
