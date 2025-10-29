import sqlite3
import pandas as pd
from pathlib import Path

db_path = Path("db/cyber.db")
report_dir = Path("reports")
report_dir.mkdir(exist_ok=True)

conn = sqlite3.connect(db_path)

df = pd.read_sql("SELECT * FROM cyber_events", conn)

summary_year = df.groupby("year").size().reset_index(name="incidents")
summary_country = df.groupby("country").size().reset_index(name="incidents")
summary_event_type = df.groupby("event_type").size().reset_index(name="incidents")

with pd.ExcelWriter(report_dir / "interim_report.xlsx") as writer:
    df.head(50).to_excel(writer, sheet_name="Sample", index=False)
    summary_year.to_excel(writer, sheet_name="By Year", index=False)
    summary_country.to_excel(writer, sheet_name="By Country", index=False)
    summary_event_type.to_excel(writer, sheet_name="By Event Type", index=False)

print("✅ Interim report generated at:", report_dir / "interim_report.xlsx")

conn.close()
