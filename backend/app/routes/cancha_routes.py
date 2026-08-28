from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.cancha_schema import CanchaSchema, CanchaUpdateSchema
from app.controllers.cancha_controller import (
    get_canchas, get_cancha, create_cancha,
    update_cancha, delete_cancha, get_disponibilidad
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/canchas", tags=["Canchas"])

@router.get("/")
def listar(activas: bool = False, db: Session = Depends(get_db)):
    return get_canchas(db, solo_activas=activas)

@router.get("/{id}/disponibilidad")
def disponibilidad(id: int, fecha: str = Query(..., description="Fecha YYYY-MM-DD"),
                   db: Session = Depends(get_db)):
    return get_disponibilidad(id, fecha, db)

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    return get_cancha(id, db)

@router.post("/")
def crear(body: CanchaSchema, db: Session = Depends(get_db), admin: dict = Depends(get_admin_actual)):
    return create_cancha(body, db)

@router.put("/{id}")
def actualizar(id: int, body: CanchaUpdateSchema, db: Session = Depends(get_db), admin: dict = Depends(get_admin_actual)):
    return update_cancha(id, body, db)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), admin: dict = Depends(get_admin_actual)):
    return delete_cancha(id, db)
