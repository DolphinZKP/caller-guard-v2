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
def mint_agent(rep_id: str, bank_name: str):
    result = mint_new_agent(rep_id, bank_name)

    conn = get_db()
    cur = conn.execute(
        "SELECT department FROM agents WHERE rep_id = ? ORDER BY created_at DESC LIMIT 1",
        (rep_id,)
    )
    row = cur.fetchone()
    print("Department row:", row)
    department = row["department"] if row and row["department"] else "Unknown"
    print("Using department:", department)

    # change agent table status to active
    # change hr activities table action to mint
    return {"message": result}

@app.post("/revoke_agent")
def revoke_agent(rep_id: str, bank_name: str):
    result = revoke_agent(rep_id, bank_name)
    # change agent table status to active
    # change hr activities table action to mint
    return {"message": result}

@app.get("/select_db")
def select_db(table_name: str):
    conn = get_db()
    cur = conn.execute(f"SELECT * FROM {table_name}")
    rows = cur.fetchall()
    return {"message": rows}

@app.post("/mint_agent")
def mint_agent(req: MintAgentRequest):
    print("Received request:", req)
    # 1. Call blockchain
    result = mint_new_agent(req.rep_id, req.bank_name)
    print("Blockchain result:", result)
    if not result["success"]:
        raise HTTPException(status_code=400, detail="Minting failed")
    # 2. Look up department for rep_id
    conn = get_db()
    cur = conn.execute(
        "SELECT department FROM agents WHERE rep_id = ? ORDER BY created_at DESC LIMIT 1",
        (req.rep_id,)
    )
    row = cur.fetchone()
    print("Department row:", row)
    department = row["department"] if row and row["department"] else "Unknown"
    print("Using department:", department)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    never_expire = "9999-12-31 23:59:59"
    # 3. Write to agents table
    try:
        conn.execute(
            "INSERT INTO agents (rep_id, department, bank_name, status, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?)",
            (req.rep_id, department, req.bank_name, "active", now, never_expire)
        )
        print("Inserted into agents")
    except Exception as e:
        print("Error inserting into agents:", e)
        raise
    # 4. Write to hr_activities table
    seed = 2345678901234567
    try:
        conn.execute(
            "INSERT INTO hr_activities (action, rep_id, bank_name, performed_by, created_at, expired_at, seed) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ("mint", req.rep_id, req.bank_name, req.performed_by, now, never_expire, seed)
        )
        print("Inserted into hr_activities")
    except Exception as e:
        print("Error inserting into hr_activities:", e)
        raise
    conn.commit()
    conn.close()
    print("Returning result:", result)
    return result

@app.post("/revoke_agent")
def revoke_agent_api(req: RevokeAgentRequest):
    result = revoke_agent(req.rep_id, req.rep_id, req.bank_name)
    if not result["success"]:
        raise HTTPException(status_code=400, detail="Revoke failed")
    conn = get_db()
    conn.execute(
        "UPDATE agents SET status = ? WHERE rep_id = ? AND bank_name = ?",
        ("revoked", req.rep_id, req.bank_name)
    )
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    never_expire = "9999-12-31 23:59:59"
    seed = 2345678901234567
    conn.execute(
        "INSERT INTO hr_activities (action, rep_id, bank_name, performed_by, created_at, expired_at, seed) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ("revoke", req.rep_id, req.bank_name, req.performed_by, now, never_expire, seed)
    )
    conn.commit()
    conn.close()
    return result

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