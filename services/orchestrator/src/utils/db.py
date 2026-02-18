import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database URL from environment
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "ikigai")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_connection():
    return engine.connect()

import json
from datetime import datetime
import uuid

def log_action(user_id: str, action_name: str, inputs: dict, outputs: dict = None, permission: str = "autonomous"):
    """
    Logs an action to the database for regulatory compliance audit trail.
    """
    query = """
    INSERT INTO action_logs (id, user_id, action_name, action_inputs, action_outputs, permission_level, execution_status, executed_at, created_at)
    VALUES (:id, :user_id, :action_name, :action_inputs, :action_outputs, :permission_level, 'completed', NOW(), NOW())
    """
    params = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "action_name": action_name,
        "action_inputs": json.dumps(inputs),
        "action_outputs": json.dumps(outputs) if outputs else None,
        "permission_level": permission
    }
    
    # In a real app, this would be async or queued. For MVP/Demo, sync execution.
    try:
        with engine.begin() as conn:
            conn.execute(text(query), params)
        print(f"✅ [AUDIT LOG] Action '{action_name}' logged for user {user_id}")
    except Exception as e:
        print(f"❌ [AUDIT LOG FAILED] {e}")
