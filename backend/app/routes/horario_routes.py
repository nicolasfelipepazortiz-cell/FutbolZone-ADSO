from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.horario_schema import HorarioSchema, HorarioUpdateSchema
from app.controllers.horario_controller import (
    get_horarios, get_horarios_cancha, get_horario,
    create_horario, update_horario, delete_horario
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/horarios", tags=["Horarios"])

@router.get("/")
def listar(db: Session = Depends(get_db), _=Depends(get_usuario_actual)):
    return get_horarios(db)

@router.get("/cancha/{cancha_id}")
def por_cancha(cancha_id: int, db: Session = Depends(get_db), _=Depends(get_usuario_actual)):
    return get_horarios_cancha(cancha_id, db)

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), _=Depends(get_usuario_actual)):
    return get_horario(id, db)

@router.post("/")
def crear(body: HorarioSchema, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return create_horario(body, db)

@router.put("/{id}")
def actualizar(id: int, body: HorarioUpdateSchema, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return update_horario(id, body, db)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return delete_horario(id, db)
