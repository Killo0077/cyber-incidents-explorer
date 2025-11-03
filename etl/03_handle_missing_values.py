#### SCRUM-3: Handle missing values in raw dataset

# This script cleans missing or invalid values in the dataset and saves a cleaned version into 'data/cleaned/' for later steps.

import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw")
CLEAN_DIR = Path("data/cleaned")
CLEAN_DIR.mkdir(parents=True, exist_ok=True)

raw_files = list(RAW_DIR.glob("*.csv"))
if not raw_files:
    raise FileNotFoundError("No raw data file found in data/raw/*.csv")

raw_files =raw_files[0]
print(f'Processing file: {raw_files}')


df = pd.read_csv(raw_files)

# Load dataset
df_clean = df.fillna("N/A") # Replace for missing values

# Save cleaned dataset
out_path = CLEAN_DIR / raw_files.name.replace(".csv", "_cleaned.csv")
df_clean.to_csv(out_path, index=False)

print(f'Cleaned data saved -> {out_path}')

