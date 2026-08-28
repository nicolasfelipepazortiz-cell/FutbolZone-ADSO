import bcrypt
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "futbolzone_secret")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/usuarios/login")


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verificar_password(plano: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plano.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def crear_token(data: dict) -> str:
    to_encode = data.copy()
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        print(f"[AUTH ERROR] Error al decodificar JWT token: {e}")
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


def get_usuario_actual(token: str = Depends(oauth2_scheme)):
    payload = decodificar_token(token)
    return payload


def get_admin_actual(payload: dict = Depends(get_usuario_actual)):
    if payload.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol administrador")
    return payload
