import sqlite3
import os

# Get the project root (one level up from utils)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
data_dir = os.path.join(project_root, "data")
os.makedirs(data_dir, exist_ok=True)

DB_PATH = os.environ.get("ZK_AGENTS_DB", os.path.join(data_dir, "oko_bank.db"))

with sqlite3.connect(DB_PATH) as conn:
    c = conn.cursor()

    # Create agents table with expired_at column
    c.execute("""
    CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rep_id TEXT,
        department TEXT,
        bank_name TEXT,
        status TEXT,         -- e.g., 'active', 'not active'
        created_at TIMESTAMP,
        expired_at TIMESTAMP
    )
    """)

    # Create hr_activities table
    c.execute("""
    CREATE TABLE IF NOT EXISTS hr_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,         -- 'mint' or 'revoke'
        rep_id TEXT,
        bank_name TEXT,
        performed_by TEXT,   -- HR user id or name
        created_at TIMESTAMP,
        expired_at TIMESTAMP,
        seed BIGINT          -- hidden: do not expose in SELECT * queries
    )
    """)

    # Create otp_sessions table
    c.execute("""
    CREATE TABLE IF NOT EXISTS otp_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rep_id TEXT,
        bank_name TEXT,
        otp TEXT,
        created_at INTEGER
    )
    """)

    # Insert synthetic agents (history) with explicit created_at and expired_at timestamps in 2024
    agents_data = [
        ("W7333", "Technical Support", "OKO Bank", "active", "2024-01-05 09:15:00", "9999-12-31 23:59:59"),
        ("B1921", "Customer Support", "OKO Bank", "active", "2024-01-10 10:20:00", "9999-12-31 23:59:59"),
        ("A4872", "Sales", "OKO Bank", "active", "2024-01-15 11:25:00", "9999-12-31 23:59:59"),
        ("S9194", "Customer Support", "OKO Bank", "revoked", "2024-01-20 12:30:00", "9999-12-31 23:59:59"),
        ("A1001", "Technical Support", "OKO Bank", "revoked", "2024-01-25 13:35:00", "9999-12-31 23:59:59"),
        ("B2002", "Sales", "OKO Bank", "active", "2024-02-01 09:00:00", "9999-12-31 23:59:59"),
        ("C3003", "Customer Support", "OKO Bank", "active", "2024-02-05 10:00:00", "9999-12-31 23:59:59"),
        ("D4004", "Technical Support", "OKO Bank", "revoked", "2024-02-10 11:00:00", "9999-12-31 23:59:59"),
        ("E5005", "Sales", "OKO Bank", "active", "2024-02-15 12:00:00", "9999-12-31 23:59:59"),
        ("F6006", "Customer Support", "OKO Bank", "active", "2024-02-20 13:00:00", "9999-12-31 23:59:59"),
        ("G7007", "Technical Support", "OKO Bank", "active", "2024-02-25 14:00:00", "9999-12-31 23:59:59"),
        ("H8008", "Sales", "OKO Bank", "revoked", "2024-03-01 09:00:00", "9999-12-31 23:59:59"),
        ("I9009", "Customer Support", "OKO Bank", "active", "2024-03-05 10:00:00", "9999-12-31 23:59:59"),
        ("J1010", "Technical Support", "OKO Bank", "active", "2024-03-10 11:00:00", "9999-12-31 23:59:59"),
        ("K1111", "Sales", "OKO Bank", "active", "2024-03-15 12:00:00", "9999-12-31 23:59:59"),
        ("L1212", "Customer Support", "OKO Bank", "revoked", "2024-03-20 13:00:00", "9999-12-31 23:59:59"),
        ("M1313", "Technical Support", "OKO Bank", "active", "2024-03-25 14:00:00", "9999-12-31 23:59:59"),
        ("N1414", "Sales", "OKO Bank", "active", "2024-04-01 09:00:00", "9999-12-31 23:59:59"),
        ("O1515", "Customer Support", "OKO Bank", "active", "2024-04-05 10:00:00", "9999-12-31 23:59:59"),
        ("P1616", "Technical Support", "OKO Bank", "revoked", "2024-04-10 11:00:00", "9999-12-31 23:59:59"),
        ("Q1717", "Sales", "OKO Bank", "active", "2024-04-15 12:00:00", "9999-12-31 23:59:59"),
        ("R1818", "Customer Support", "OKO Bank", "active", "2024-04-20 13:00:00", "9999-12-31 23:59:59"),
        ("S1919", "Technical Support", "OKO Bank", "active", "2024-04-25 14:00:00", "9999-12-31 23:59:59"),
        ("T2020", "Sales", "OKO Bank", "revoked", "2024-05-01 09:00:00", "9999-12-31 23:59:59"),
        ("U2121", "Customer Support", "OKO Bank", "active", "2024-05-05 10:00:00", "9999-12-31 23:59:59"),
        ("V2222", "Technical Support", "OKO Bank", "active", "2024-05-10 11:00:00", "9999-12-31 23:59:59"),
        ("W2323", "Sales", "OKO Bank", "active", "2024-05-15 12:00:00", "9999-12-31 23:59:59"),
    ]
    c.executemany(
        "INSERT INTO agents (rep_id, department, bank_name, status, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?)",
        agents_data
    )

    # Insert synthetic HR activities (history) with explicit created_at and expired_at timestamps in 2024
   
    hr_activities_data = [
        ("mint", "W7333", "OKO Bank", "OKO_HR123", "2024-01-05 09:16:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "B1921", "OKO Bank", "OKO_HR123", "2024-01-10 10:21:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "A4872", "OKO Bank", "OKO_HR123", "2024-01-15 11:26:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "S9194", "OKO Bank", "OKO_HR123", "2024-01-20 12:31:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "A1001", "OKO Bank", "OKO_HR123", "2024-01-25 13:36:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "B2002", "OKO Bank", "OKO_HR123", "2024-02-01 09:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "C3003", "OKO Bank", "OKO_HR123", "2024-02-05 10:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "D4004", "OKO Bank", "OKO_HR123", "2024-02-10 11:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "E5005", "OKO Bank", "OKO_HR123", "2024-02-15 12:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "F6006", "OKO Bank", "OKO_HR123", "2024-02-20 13:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "G7007", "OKO Bank", "OKO_HR123", "2024-02-25 14:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "H8008", "OKO Bank", "OKO_HR123", "2024-03-01 09:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "I9009", "OKO Bank", "OKO_HR123", "2024-03-05 10:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "J1010", "OKO Bank", "OKO_HR123", "2024-03-10 11:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "K1111", "OKO Bank", "OKO_HR123", "2024-03-15 12:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "L1212", "OKO Bank", "OKO_HR123", "2024-03-20 13:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "M1313", "OKO Bank", "OKO_HR123", "2024-03-25 14:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "N1414", "OKO Bank", "OKO_HR123", "2024-04-01 09:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "O1515", "OKO Bank", "OKO_HR123", "2024-04-05 10:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "P1616", "OKO Bank", "OKO_HR123", "2024-04-10 11:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "Q1717", "OKO Bank", "OKO_HR123", "2024-04-15 12:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "R1818", "OKO Bank", "OKO_HR123", "2024-04-20 13:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "S1919", "OKO Bank", "OKO_HR123", "2024-04-25 14:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("revoke", "T2020", "OKO Bank", "OKO_HR123", "2024-05-01 09:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "U2121", "OKO Bank", "OKO_HR123", "2024-05-05 10:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "V2222", "OKO Bank", "OKO_HR123", "2024-05-10 11:01:00", "9999-12-31 23:59:59", 2345678901234567),
        ("mint", "W2323", "OKO Bank", "OKO_HR123", "2024-05-15 12:01:00", "9999-12-31 23:59:59", 2345678901234567),
    ]
    
    c.executemany(
        "INSERT INTO hr_activities (action, rep_id, bank_name, performed_by, created_at, expired_at, seed) VALUES (?, ?, ?, ?, ?, ?, ?)",
        hr_activities_data
    )

    # Insert synthetic OTP sessions (history)
    otp_sessions_data = [
        ("W7333", "OKO Bank", "123456", 1717100401),
        ("B1921", "OKO Bank", "654321", 1717100501),
        ("A4872", "OKO Bank", "111222", 1717100601),
        ("S9194", "OKO Bank", "333444", 1717100701),
        ("A1001", "OKO Bank", "555666", 1717100801),
        ("B2002", "OKO Bank", "222333", 1717100901),
        ("C3003", "OKO Bank", "444555", 1717101001),
        ("D4004", "OKO Bank", "666777", 1717101101),
        ("E5005", "OKO Bank", "888999", 1717101201),
        ("F6006", "OKO Bank", "101112", 1717101301),
        ("G7007", "OKO Bank", "131415", 1717101401),
        ("H8008", "OKO Bank", "161718", 1717101501),
        ("I9009", "OKO Bank", "192021", 1717101601),
        ("J1010", "OKO Bank", "222324", 1717101701),
        ("K1111", "OKO Bank", "252627", 1717101801),
        ("L1212", "OKO Bank", "282930", 1717101901),
        ("M1313", "OKO Bank", "313233", 1717102001),
        ("N1414", "OKO Bank", "343536", 1717102101),
        ("O1515", "OKO Bank", "373839", 1717102201),
        ("P1616", "OKO Bank", "404142", 1717102301),
        ("Q1717", "OKO Bank", "434445", 1717102401),
        ("R1818", "OKO Bank", "464748", 1717102501),
        ("S1919", "OKO Bank", "495051", 1717102601),
        ("T2020", "OKO Bank", "525354", 1717102701),
        ("U2121", "OKO Bank", "555657", 1717102801),
        ("V2222", "OKO Bank", "585960", 1717102901),
        ("W2323", "OKO Bank", "616263", 1717103001),
    ]
    c.executemany(
        "INSERT INTO otp_sessions (rep_id, bank_name, otp, created_at) VALUES (?, ?, ?, ?)",
        otp_sessions_data
    )

    conn.commit()

print(f"Database initialized at {DB_PATH}")