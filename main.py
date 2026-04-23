from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Election Forecast API")

# Keep DB URL configurable via environment while providing a default.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://ec_user:ecuser999$@varshadb.cvws1eblufqr.us-east-2.rds.amazonaws.com:5432/EC_data_analysis",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


class ConstituencyResultItem(BaseModel):
    district: str
    constituency: str
    name: Optional[str] = None
    phone_number: Optional[int] = None
    winner: Optional[str] = None
    margin: Optional[int] = None
    ldf_share_percentage: Optional[float] = None
    udf_share_percentage: Optional[float] = None
    nda_share_percentage: Optional[float] = None
    other_share_percentage: Optional[float] = None


class ConstituencyResultBatch(BaseModel):
    results: List[ConstituencyResultItem]


def _ensure_results_table():
    statements = [
        text(
            """
            CREATE SEQUENCE IF NOT EXISTS constituencies_results_id_seq
            """
        ),
        text(
            """
            CREATE TABLE IF NOT EXISTS public.constituencies_results
            (
                id integer NOT NULL DEFAULT nextval('constituencies_results_id_seq'::regclass),
                district character varying(100) NOT NULL,
                constituency character varying(100) NOT NULL,
                created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                name character varying(100),
                phone_number int,
                winner character varying(10),
                margin int,
                ldf_share_percentage float,
                udf_share_percentage float,
                nda_share_percentage float,
                other_share_percentage float,
                CONSTRAINT constituencies_result_pkey PRIMARY KEY (id)
            )
            """
        ),
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(statement)


@app.on_event("startup")
def startup_event():
    _ensure_results_table()


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
    query_with_abbr = text(
        """
        SELECT
            district,
            dist_abbr,
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

    query_without_abbr = text(
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
            try:
                rows = connection.execute(query_with_abbr).mappings().all()
            except SQLAlchemyError:
                rows = None

        if rows is None:
            with engine.connect() as connection:
                rows = connection.execute(query_without_abbr).mappings().all()

        response = []
        for row in rows:
            response.append(
                {
                    "district": _pick(row, "district"),
                    "distAbbr": _pick(row, "dist_abbr", "distAbbr", "district"),
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


@app.post("/api/constituencies-results")
def save_constituencies_results(payload: ConstituencyResultBatch):
    if not payload.results:
        raise HTTPException(status_code=400, detail="No results provided")

    allowed_winners = {"LDF", "UDF", "NDA", "OTHERS"}
    for index, item in enumerate(payload.results, start=1):
        if not item.name or not str(item.name).strip():
            raise HTTPException(status_code=400, detail=f"Row {index}: name is mandatory")

        if item.phone_number is None or item.phone_number < 110000 or item.phone_number > 199999:
            raise HTTPException(status_code=400, detail=f"Row {index}: phone_number must be last 5 digits + 100000")

        winner_value = (item.winner or "").strip().upper()
        if winner_value not in allowed_winners:
            raise HTTPException(status_code=400, detail=f"Row {index}: winner is mandatory and must be one of {', '.join(sorted(allowed_winners))}")

        if item.margin is None or item.margin <= 0:
            raise HTTPException(status_code=400, detail=f"Row {index}: margin is mandatory and must be greater than 0")

    insert_query = text(
        """
        INSERT INTO public.constituencies_results (
            district,
            constituency,
            name,
            phone_number,
            winner,
            margin,
            ldf_share_percentage,
            udf_share_percentage,
            nda_share_percentage,
            other_share_percentage,
            updated_at
        ) VALUES (
            :district,
            :constituency,
            :name,
            :phone_number,
            :winner,
            :margin,
            :ldf_share_percentage,
            :udf_share_percentage,
            :nda_share_percentage,
            :other_share_percentage,
            CURRENT_TIMESTAMP
        )
        """
    )

    try:
        rows = [item.model_dump() for item in payload.results]
        with engine.begin() as connection:
            connection.execute(insert_query, rows)

        return {
            "status": "success",
            "inserted": len(rows),
        }
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {str(exc)}") from exc


@app.get("/")
def root():
    return FileResponse("home.html")

app.mount("/", StaticFiles(directory=".", html=True), name="static")
