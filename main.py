from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Election Forecast API")

constituencies = [
    {
        "district": "NORTHLAND",
        "constituency": "Frozen Peak",
        "ldf": "Arun Kumar",
        "udf": "Benjamin B.",
        "nda": "Charlie C.",
        "totalVoters": "215,000",
        "votingPercent": "78.50%",
        "polledVotes": "168,775"
    },
    {
        "district": "NORTHLAND",
        "constituency": "River Run",
        "ldf": "David Deep",
        "udf": "Edward E.",
        "nda": "Frank F.",
        "totalVoters": "198,000",
        "votingPercent": "82.10%",
        "polledVotes": "162,558"
    },
    {
        "district": "NORTHLAND",
        "constituency": "Iron Gate",
        "ldf": "George G.",
        "udf": "Harry H.",
        "nda": "Ian I.",
        "totalVoters": "205,500",
        "votingPercent": "75.40%",
        "polledVotes": "154,947"
    },
    {
        "district": "WESTCOAST",
        "constituency": "Sandy Shores",
        "ldf": "Jack Java",
        "udf": "Kevin K.",
        "nda": "Liam L.",
        "totalVoters": "222,000",
        "votingPercent": "80.80%",
        "polledVotes": "179,376"
    },
    {
        "district": "WESTCOAST",
        "constituency": "Ocean View",
        "ldf": "Mike Macro",
        "udf": "Noah N.",
        "nda": "Oscar O.",
        "totalVoters": "185,000",
        "votingPercent": "74.20%",
        "polledVotes": "137,270"
    },
    {
        "district": "HIGHLANDS",
        "constituency": "Misty Mount",
        "ldf": "Paul Ping",
        "udf": "Quinn Q.",
        "nda": "Ryan R.",
        "totalVoters": "192,000",
        "votingPercent": "79.90%",
        "polledVotes": "153,408"
    },
    {
        "district": "HIGHLANDS",
        "constituency": "Green Valley",
        "ldf": "Sam Stack",
        "udf": "Tom T.",
        "nda": "Uma U.",
        "totalVoters": "210,000",
        "votingPercent": "81.40%",
        "polledVotes": "170,940"
    },
    {
        "district": "CENTRALIA",
        "constituency": "Metro Hub",
        "ldf": "Victor Vector",
        "udf": "Will W.",
        "nda": "Xander X.",
        "totalVoters": "241,000",
        "votingPercent": "84.80%",
        "polledVotes": "204,368"
    },
    {
        "district": "CENTRALIA",
        "constituency": "Cyber City",
        "ldf": "Yuvraj Yield",
        "udf": "Zain Z.",
        "nda": "Abe A.",
        "totalVoters": "201,000",
        "votingPercent": "70.00%",
        "polledVotes": "140,700"
    },
    {
        "district": "SOUTHVALE",
        "constituency": "Sunset Bay",
        "ldf": "Bob Binary",
        "udf": "Chris C.",
        "nda": "Dan D.",
        "totalVoters": "177,000",
        "votingPercent": "73.60%",
        "polledVotes": "130,272"
    }
]

@app.get("/api/constituencies")
def api_constituencies():
    return constituencies

app.mount("/", StaticFiles(directory=".", html=True), name="static")
