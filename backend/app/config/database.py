from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "3306")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME     = os.getenv("DB_NAME", "futbolzone")

MYSQL_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
SQLITE_URL = "sqlite:///./futbolzone.db"

def _get_engine():
    # Intentar conexión MySQL primero si está configurada
    try:
        engine = create_engine(
            MYSQL_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=False,
            connect_args={"connect_timeout": 1}
        )
        # Probar conexión
        with engine.connect() as conn:
            pass
        print("[DB] Conectado exitosamente a la base de datos MySQL.")
        return engine
    except Exception:
        print("[DB Info] Usando base de datos local SQLite (futbolzone.db)...")
        return create_engine(
            SQLITE_URL,
            connect_args={"check_same_thread": False},
            echo=False
        )

engine = _get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

