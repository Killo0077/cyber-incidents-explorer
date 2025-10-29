from pathlib import Path
import pandas as pd

DATA = Path("data/cyber_events_2014_2025.csv")
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)
OUT_FILE = OUT_DIR / "cyber_clean.csv"

def main():
    # Just load the CSV and bail out if it's not there
    if not DATA.exists():
        print(f"Can't find the CSV at {DATA}.")
        return

    df = pd.read_csv(DATA, low_memory=False)
    print(f"Loaded: {df.shape[0]} rows x {df.shape[1]} columns")

    # Drop a couple of columns we decided we don't need
    for col in ["slug", "original_method"]:
        if col in df.columns:
            df = df.drop(columns=[col])
            print(f"– Removed column: {col}")

    # Quick tidy-up for text columns (trim spaces, make real NaNs)
    for col in df.select_dtypes(include="object").columns:
        df[col] = (
            df[col]
            .astype(str)
            .str.strip()
            .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
        )

    # Parse dates if those columns exist (errors go to NaT, which is fine)
    for date_col in ["event_date", "reported_date"]:
        if date_col in df.columns:
            df[date_col] = pd.to_datetime(df[date_col], errors="coerce")

    # If we have event_date, it's handy to have year/month too
    if "event_date" in df.columns:
        if "year" not in df.columns:
            df["year"] = df["event_date"].dt.year
        if "month" not in df.columns:
            df["month"] = df["event_date"].dt.month

    # Keep events roughly in our project window (2014–2025). If year is missing, keep it.
    if "year" in df.columns:
        before = len(df)
        df = df[df["year"].between(2014, 2025, inclusive="both") | df["year"].isna()]
        after = len(df)
        if after != before:
            print(f"– Filtered by year 2014–2025: {before} → {after}")

    # If a column is 95%+ empty, it's probably not useful for us right now
    null_ratio = df.isna().mean()
    sparse_cols = [c for c, r in null_ratio.items() if r > 0.95]
    if sparse_cols:
        df = df.drop(columns=sparse_cols)
        print("– Dropped very sparse columns:", ", ".join(sparse_cols))

    # De-duplicate just in case
    before = len(df)
    df = df.drop_duplicates()
    print(f"– Duplicates removed: {before - len(df)}")

    # Save the cleaned file
    df.to_csv(OUT_FILE, index=False)
    print(f"Saved cleaned dataset to: {OUT_FILE}")
    print("Final shape:", df.shape)

if __name__ == "__main__":
    main()
