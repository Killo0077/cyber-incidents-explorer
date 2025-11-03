### SCRUM-66: Handle duplicated values in the raw dataset.

# This script loads the cleaned dataset from data/cleaned/, removes duplicates rows and saves the result into outputs/cleaned_no_duplicates.csv


import pandas as pd
from pathlib import Path

# Definition file Paths
INPUT_FILE = Path("data/cleaned/cleaned_dataset.csv")
OUTPUT_FILE = Path("outputs/cleaned_no_duplicates.csv")

if not INPUT_FILE.exists():
    raise FileNotFoundError(f'Missing input file: {INPUT_FILE}')


# Load the data
df = pd.read_csv(INPUT_FILE)

# Remove duplicates
initial_rows = len(df)
df = df.drop_duplicates()
final_rows = len(df)


# Save cleaned file
df.to_csv(OUTPUT_FILE, index=False)


print(f'Removed {initial_rows - final_rows} duplicate rows. Clean data saved to {OUTPUT_FILE}')

