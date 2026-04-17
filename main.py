from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os

app = FastAPI(title="Election Forecast API")

# Keep DB URL configurable via environment while providing a default.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://ec_user:ecuser999$@varshadb.cvws1eblufqr.us-east-2.rds.amazonaws.com:5432/EC_data_analysis",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def _pick(record, *keys):
    for key in keys:
        if key in record and record[key] is not None:
            return record[key]
    return ""


def _format_number(value):
    if value is None:
        return ""
    if isinstance(value, (int, float)):
        return f"{int(value):,}"

    as_text = str(value).strip()
    if not as_text:
        return ""

    try:
        numeric = int(float(as_text.replace(",", "")))
        return f"{numeric:,}"
    except ValueError:
        return as_text


def _format_percent(value):
    if value is None:
        return ""

    if isinstance(value, (int, float)):
        return f"{float(value):.2f}%"

    as_text = str(value).strip()
    if not as_text:
        return ""

    if as_text.endswith("%"):
        return as_text

    try:
        return f"{float(as_text):.2f}%"
    except ValueError:
        return as_text

@app.get("/api/constituencies")
def api_constituencies():
    query = text(
        """
        SELECT
            district,
            constituency,
            ldf_candidate,
            udf_candidate,
            nda_candidate,
            total_voters,
            voting_percent,
            polled_votes
        FROM constituencies
        ORDER BY id
        """
    )

    try:
        with engine.connect() as connection:
            rows = connection.execute(query).mappings().all()

        response = []
        for row in rows:
            response.append(
                {
                    "district": _pick(row, "district"),
                    "constituency": _pick(row, "constituency"),
                    "ldf": _pick(row, "ldf_candidate", "ldf"),
                    "udf": _pick(row, "udf_candidate", "udf"),
                    "nda": _pick(row, "nda_candidate", "nda"),
                    "totalVoters": _format_number(_pick(row, "total_voters", "totalVoters")),
                    "votingPercent": _format_percent(_pick(row, "voting_percent", "votingPercent")),
                    "polledVotes": _format_number(_pick(row, "polled_votes", "polledVotes")),
                }
            )

        return response
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {str(exc)}") from exc

app.mount("/", StaticFiles(directory=".", html=True), name="static")
