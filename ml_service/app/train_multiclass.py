# app/train_multiclass.py
import os, joblib, argparse
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def preprocess(s):
    return " ".join(str(s).split()).strip().lower()

def train(csv_path, embedder="sentence-transformers/all-MiniLM-L6-v2", out="risk_multiclass.joblib", sample=False):
    df = pd.read_csv(csv_path)
    df['text'] = df['text'].apply(preprocess)
    df = df.dropna(subset=['text','label'])
    labels = df['label'].astype(str).tolist()

    le = LabelEncoder()
    y = le.fit_transform(labels)
    texts = df['text'].tolist()

    embedder = SentenceTransformer(embedder)
    X = embedder.encode(texts, show_progress_bar=True, convert_to_numpy=True)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    import warnings

    # Try modern sklearn signature first; fall back for older/incompatible installs
    try:
        clf = LogisticRegression(max_iter=2000, class_weight='balanced', multi_class='multinomial', solver='saga')
    except TypeError:
        warnings.warn("LogisticRegression constructor doesn't accept 'multi_class' or 'solver' parameters in this sklearn installation. Falling back to a simpler constructor. Consider upgrading scikit-learn (pip install -U scikit-learn).")
        try:
            clf = LogisticRegression(max_iter=2000, class_weight='balanced', solver='saga')
        except TypeError:
            clf = LogisticRegression(max_iter=2000)

    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    joblib.dump({"model": clf, "label_encoder": le, "embedder": embedder}, os.path.join(MODEL_DIR, out))
    print("Saved model to:", os.path.join(MODEL_DIR, out))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True)
    parser.add_argument("--out", default="risk_multiclass.joblib")
    args = parser.parse_args()
    train(args.csv, out=args.out)
