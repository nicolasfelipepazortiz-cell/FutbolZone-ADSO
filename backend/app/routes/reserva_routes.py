from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.reserva_schema import ReservaSchema, ReservaUpdateSchema
from app.controllers.reserva_controller import (
    get_reservas, get_reserva, get_reservas_usuario,
    create_reserva, update_reserva, delete_reserva
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/reservas", tags=["Reservas"])

# ── Rutas estáticas primero ─────────────────────────────
@router.get("/mis-reservas")
def mis_reservas(db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    usuario_id = int(usuario_actual.get("sub", 1))
    return get_reservas_usuario(usuario_id, db)

# ── General y Admin ──────────────────────────────────────
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return get_reservas(db)

@router.post("/")
def crear(body: ReservaSchema, db: Session = Depends(get_db), usuario_actual: dict = Depends(get_usuario_actual)):
    usuario_id = int(usuario_actual.get("sub", 1))
    return create_reserva(body, usuario_id, db)

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    return get_reserva(id, db)

@router.put("/{id}")
def actualizar(id: int, body: ReservaUpdateSchema, db: Session = Depends(get_db)):
    return update_reserva(id, body, db)

@router.delete("/{id}")
def cancelar(id: int, db: Session = Depends(get_db)):
    return delete_reserva(id, db)

