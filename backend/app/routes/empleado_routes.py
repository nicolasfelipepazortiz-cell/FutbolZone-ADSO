from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.empleado_schema import EmpleadoSchema, EmpleadoUpdateSchema
from app.controllers.empleado_controller import (
    get_empleados, get_empleado,
    create_empleado, update_empleado, delete_empleado
)
from app.utils.auth import get_admin_actual

router = APIRouter(prefix="/api/empleados", tags=["Empleados"])

@router.get("/")
def listar(db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return get_empleados(db)

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return get_empleado(id, db)

@router.post("/")
def crear(body: EmpleadoSchema, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return create_empleado(body, db)

@router.put("/{id}")
def actualizar(id: int, body: EmpleadoUpdateSchema, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return update_empleado(id, body, db)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return delete_empleado(id, db)
