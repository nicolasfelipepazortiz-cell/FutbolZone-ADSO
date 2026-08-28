from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.torneo_schema import TorneoSchema, TorneoUpdateSchema, InscripcionSchema
from app.controllers.torneo_controller import (
    get_torneos, get_torneo, create_torneo, update_torneo,
    delete_torneo, inscribir_usuario, get_inscripciones, delete_inscripcion
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/torneos", tags=["Torneos"])

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return get_torneos(db)


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    return get_torneo(id, db)


@router.get("/{id}/inscripciones")
def listar_inscripciones(id: int, db: Session = Depends(get_db)):
    return get_inscripciones(id, db)


@router.post("/")
def crear(body: TorneoSchema, db: Session = Depends(get_db)):
    return create_torneo(body, db)


@router.post("/inscribirme")
def inscribirse(body: InscripcionSchema, db: Session = Depends(get_db)):
    return inscribir_usuario(body, db)


@router.put("/{id}")
def actualizar(id: int, body: TorneoUpdateSchema, db: Session = Depends(get_db)):
    return update_torneo(id, body, db)


@router.delete("/inscripciones/{id}")
def cancelar_inscripcion(id: int, db: Session = Depends(get_db)):
    return delete_inscripcion(id, db)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_torneo(id, db)
