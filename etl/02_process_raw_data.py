# SCRUM-2: Process raw dataset structure
# Loads raw dataset, inspects structure and saves summary to outputs/data_structure.txt

import argparse
from pathlib import Path
import pandas as pd

parser = argparse.ArgumentParser(description="SCRUM-2: Inspect dataset structure.")
parser.add_argument("--input", type=str, help="Path to input dataset (.csv/.xlsx)", default=None)
parser.add_argument("--output", type=str, help="Path to output report file", default=None)
args = parser.parse_args()

RAW_DIR = Path("data/raw")
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 1) Pick input file (CLI or auto-detect newest)
if args.input:
    RAW_FILE = Path(args.input)
    if not RAW_FILE.exists():
        raise FileNotFoundError(f"Input file not found: {RAW_FILE}")
else:
   # Try to find the raw file automatically (case-insensitive + deterministic)
    candidates = []
    for ext in ("*.csv", "*.CSV", "*.xlsx", "*.XLSX", "*.xls", "*.XLS"):
        candidates.extend(RAW_DIR.glob(ext))
    if not candidates:
       # Pick the most recently modified file
        raise FileNotFoundError("No raw data file found in data/raw (.csv/.xlsx/.xls)")
    RAW_FILE = max(candidates, key=lambda p: p.stat().st_mtime)

print(f"Using raw file: {RAW_FILE}")

# 2) LOAD the data (this was missing)
if RAW_FILE.suffix.lower() == ".csv":
    df = pd.read_csv(RAW_FILE)
else:
    df = pd.read_excel(RAW_FILE)

# 3) Build the structure report
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

# 4) Resolve output path and ensure folder exists
report_path = Path(args.output) if args.output else OUT_DIR / "data_structure.txt"
report_path.parent.mkdir(parents=True, exist_ok=True)

report_path.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote structure report -> {report_path}")
