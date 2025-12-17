# app/create_stratified_sample.py
import pandas as pd
import numpy as np
from pathlib import Path

SRC = Path("data/combined_clean.csv")
OUT = Path("data/sample_10k_strat.csv")
N = 10000

df = pd.read_csv(SRC)
label_col = "label"
counts = df[label_col].value_counts()
print("Original class counts:\n", counts)

# proportional sample sizes
proportions = counts / counts.sum()
sample_counts = (proportions * N).round().astype(int).to_dict()

# ensure each class has at least 10 examples
for k in sample_counts:
    if sample_counts[k] < 10:
        sample_counts[k] = min(10, counts[k])

# adjust to match N
while sum(sample_counts.values()) != N:
    diff = N - sum(sample_counts.values())
    # distribute
    for k in sample_counts:
        if diff == 0: break
        sample_counts[k] += 1 if diff > 0 else -1
        diff = N - sum(sample_counts.values())

print("Sampling counts:", sample_counts)

parts = []
rng = np.random.RandomState(42)
for label, cnt in sample_counts.items():
    subset = df[df[label_col] == label]
    if len(subset) <= cnt:
        parts.append(subset)
    else:
        parts.append(subset.sample(cnt, random_state=rng))
sample = pd.concat(parts).sample(frac=1, random_state=42).reset_index(drop=True)
sample.to_csv(OUT, index=False)
print("Saved", OUT, "with distribution:\n", sample[label_col].value_counts())
