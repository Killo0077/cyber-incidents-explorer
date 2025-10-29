# Goal: take outputs/cyber_clean.csv and push it into a local SQLite DB
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine, text

CSV = Path("outputs/cyber_clean.csv")
DB_PATH = Path("db/cyber.db")
DB_PATH.parent.mkdir(exist_ok=True)

TABLE = "cyber_events"

def main():
    # Sanity check: do we have the cleaned CSV?
    if not CSV.exists():
        print(f"Cleaned CSV not found at: {CSV}")
        return

    # Load the data
    df = pd.read_csv(CSV, low_memory=False)
    print(f"Loaded cleaned data: {df.shape[0]} rows x {df.shape[1]} columns")

    # Open a SQLite connection (local file DB)
    engine = create_engine(f"sqlite:///{DB_PATH}")

    # Make column names SQL-friendly (lowercase, underscores, etc.)
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("-", "_")
    )

    # Write the whole DataFrame to a table (replace for simplicity while iterating)
    df.to_sql(TABLE, con=engine, if_exists="replace", index=False)
    print(f"Wrote {len(df):,} rows into '{TABLE}' at {DB_PATH}")

    # A few indexes that usually help queries in dashboards/APIs
    index_candidates = ["year", "country", "attack_type", "target_industry", "event_date"]
    with engine.begin() as conn:
        for col in index_candidates:
            if col in df.columns:
                idx = f"idx_{TABLE}_{col}"
                conn.execute(text(f"CREATE INDEX IF NOT EXISTS {idx} ON {TABLE} ({col});"))
        # Quick row count check
        total = conn.execute(text(f"SELECT COUNT(*) FROM {TABLE};")).scalar()
        print(f"🔎 Row count check: {total}")

    print("All set. Your Web UI / AI layer can query SQLite now.")

if __name__ == "__main__":
    main()
