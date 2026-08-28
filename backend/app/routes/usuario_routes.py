from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.usuario_schema import UsuarioSchema, UsuarioUpdateSchema, UsuarioLoginSchema
from app.controllers.usuario_controller import (
    get_usuarios, get_usuario, get_clientes,
    create_usuario, login_usuario,
    update_usuario, delete_usuario, cambiar_rol
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

# ── Públicos ────────────────────────────────────────────
@router.post("/registro")
def registrar(body: UsuarioSchema, db: Session = Depends(get_db)):
    return create_usuario(body, db)

@router.post("/login")
def login(body: UsuarioLoginSchema, db: Session = Depends(get_db)):
    return login_usuario(body, db)

# ── Admin ────────────────────────────────────────────────
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return get_usuarios(db)

@router.get("/clientes")
def listar_clientes(db: Session = Depends(get_db)):
    return get_clientes(db)

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    return get_usuario(id, db)

@router.put("/{id}")
def actualizar(id: int, body: UsuarioUpdateSchema, db: Session = Depends(get_db)):
    return update_usuario(id, body, db)

@router.patch("/{id}/rol")
def cambiar_rol_usuario(id: int, rol: str, db: Session = Depends(get_db)):
    return cambiar_rol(id, rol, db)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_usuario(id, db)
