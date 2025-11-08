# SCRUM-2: Process raw dataset structure
# Loads raw dataset, inspects structure and saves summary to outputs/data_structure.txt

import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw")
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Try to find the first raw file automatically (case-insensitive + deterministic)
candidates = []
for ext in ("*.csv", "*.CSV", "*.xlsx", "*.XLSX", "*.xls", "*.XLS"):
    candidates.extend(RAW_DIR.glob(ext))

if not candidates:
    raise FileNotFoundError("No raw data file found in data/raw (.csv/.xlsx/.xls)")

# Pick the most recently modified file
RAW_FILE = max(candidates, key=lambda p: p.stat().st_mtime)
print(f"Using raw file: {RAW_FILE}")


# Load depending on extension
if RAW_FILE.suffix.lower() == ".csv":
    df = pd.read_csv(RAW_FILE)
else:
    df = pd.read_excel(RAW_FILE)

# Build a structure report

lines = [
    f"File: {RAW_FILE.name}",
    f"Rows x Cols: {df.shape}",
    "\nColumn dtypes:",
    df.dtypes.to_string(),
    "\n\nNull counts per column:",
    df.isna().sum().to_string(),
    "\n\nSample rows (head 10)",
    df.head(10).to_string(),
]

report_path = OUT_DIR / "data_structure.txt"
report_path.write_text("\n".join(lines), encoding="utf-8")

print(f"Wrote structure report -> {report_path}")