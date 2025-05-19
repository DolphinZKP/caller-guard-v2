from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import os
from datetime import datetime
from .manage_agent import mint_new_agent, revoke_agent

DB_PATH = r"D:\caller-guard-v2\data\oko_bank.db"

app = FastAPI()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class MintAgentRequest(BaseModel):
    rep_id: str
    bank_name: str
    performed_by: str

class RevokeAgentRequest(BaseModel):
    rep_id: str
    bank_name: str
    performed_by: str

class OTPRequest(BaseModel):
    rep_id: str
    bank_name: str
    otp: str
    expires_at: int

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.post("/mint_agent")
def mint_agent(req: MintAgentRequest):
    try:
        rep_id = req.rep_id
        bank_name = req.bank_name
        performed_by = req.performed_by
        result = mint_new_agent(rep_id, bank_name)
        conn = get_db()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        never_expire = "9999-12-31 23:59:59"
        # Try to get department from previous records
        cur = conn.execute(
            "SELECT department FROM agents WHERE rep_id = ? ORDER BY created_at DESC LIMIT 1",
            (rep_id,)
        )
        row = cur.fetchone()
        department = row["department"] if row and row["department"] else "Unknown"
        # Insert new agent record
        conn.execute(
            "INSERT INTO agents (rep_id, department, bank_name, status, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?)",
            (rep_id, department, bank_name, "active", now, never_expire)
        )
        conn.commit()
        conn.close()
        return {"success": True, "message": f"Agent {rep_id} minted for {bank_name}", "department": department}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/revoke_agent")
def revoke_agent(rep_id: str, bank_name: str):
    result = revoke_agent(rep_id, bank_name)
    # change agent table status to active
    # change hr activities table action to mint
    return {"message": result}


@app.post("/generate_otp")
def generate_otp(req: OTPRequest):
    conn = get_db()
    now = int(datetime.now().timestamp())
    conn.execute(
        "INSERT INTO otp_sessions (rep_id, bank_name, otp, timestamp, expires_at) VALUES (?, ?, ?, ?, ?)",
        (req.rep_id, req.bank_name, req.otp, now, req.expires_at)
    )
    conn.commit()
    conn.close()
    return {"success": True, "otp": req.otp, "timestamp": now}