<<<<<<< HEAD
# Goal: take outputs/cyber_clean.csv and push it into a local SQLite DB
=======
#take outputs/cyber_clean.csv and push it into a local SQLite DB
>>>>>>> bcbd3d06141eabeb17cc13d8f9a40ed27ef8b2e4
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine, text

CSV = Path("outputs/cyber_clean.csv")
DB_PATH = Path("db/cyber.db")
DB_PATH.parent.mkdir(exist_ok=True)

TABLE = "cyber_events"

def main():
<<<<<<< HEAD
    # Sanity check: do we have the cleaned CSV?
=======
    # check if have the cleaned CSV
>>>>>>> bcbd3d06141eabeb17cc13d8f9a40ed27ef8b2e4
    if not CSV.exists():
        print(f"Cleaned CSV not found at: {CSV}")
        return

<<<<<<< HEAD
    # Load the data
    df = pd.read_csv(CSV, low_memory=False)
    print(f"Loaded cleaned data: {df.shape[0]} rows x {df.shape[1]} columns")

    # Open a SQLite connection (local file DB)
    engine = create_engine(f"sqlite:///{DB_PATH}")

    # Make column names SQL-friendly (lowercase, underscores, etc.)
=======
    # load data
    df = pd.read_csv(CSV, low_memory=False)
    print(f"Loaded cleaned data: {df.shape[0]} rows x {df.shape[1]} columns")

    # open a sqLite connection
    engine = create_engine(f"sqlite:///{DB_PATH}")

    # column names sql friendly
>>>>>>> bcbd3d06141eabeb17cc13d8f9a40ed27ef8b2e4
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("-", "_")
    )

<<<<<<< HEAD
    # Write the whole DataFrame to a table (replace for simplicity while iterating)
=======
    # write dataframe to a table 
>>>>>>> bcbd3d06141eabeb17cc13d8f9a40ed27ef8b2e4
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
<<<<<<< HEAD
        print(f"🔎 Row count check: {total}")
=======
        print(f"Row count check: {total}")
>>>>>>> bcbd3d06141eabeb17cc13d8f9a40ed27ef8b2e4

    print("All set. Your Web UI / AI layer can query SQLite now.")

if __name__ == "__main__":
    main()
