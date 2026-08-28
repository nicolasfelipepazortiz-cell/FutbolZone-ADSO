from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.config.database import get_db
from app.schemas.resena_schema import ResenaCreateSchema
from app.controllers.resena_controller import listar_resenas, crear_resena
from app.utils.auth import get_usuario_actual

router = APIRouter(prefix="/api/resenas", tags=["Reseñas"])


@router.get("")
def get_resenas(cancha_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    return listar_resenas(db=db, cancha_id=cancha_id)


@router.post("")
def post_resena(
    schema: ResenaCreateSchema,
    current_user: dict = Depends(get_usuario_actual),
    db: Session = Depends(get_db)
):
    usuario_id = int(current_user.get("sub"))
    return crear_resena(db=db, schema=schema, usuario_id=usuario_id)
