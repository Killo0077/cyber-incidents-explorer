# Cyber Incidents Explorer

A student Agile process project for exploring and analyzing global cyber-incidents data. 

## Overview

The system performs a simple **ETL (Extract-Transform-Load)** Workflow:

1. **Extract** raw data files from external sources
2. **Clean** and standardize values using Python scripts in the `etl/` folder
3. **Load** the cleaned data into a local SQLite database (see `db/`)
4. **Explore** and generate summary reports from the cleaned dataset (see `reports/`)

---------------
etl/ -> Data cleaning & transformation scripts
db/ -> SQLite database and schema
data/ -> Raw and cleaned data files
outputs/ -> Generated outputs and reports
reports/ -> Visual or textual analysis reports

### Setup Instructions

### Requirements

- Python 3.11 +
- Git
- (Optional) SQLite 3 or Docker

### Installation
```bash
# Clone the repository
git clone https://githoub.com/Killo0077/cyber-incidents-explorer.git
cd cyber-incidents-explorer

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt


### Usage 
```bash
python etl/01_load_to_db.py



######## Team ##########

- Gabriel Zomignani
- Pawel Wlodarczyk
- Pablo Baena


