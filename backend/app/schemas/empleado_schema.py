from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EmpleadoSchema(BaseModel):
    nombre:   str
    apellido: str
    cargo:    str   # Administrador | Coordinador | Mantenimiento | Atención al cliente | Seguridad
    telefono: Optional[str] = None
    email:    str


class EmpleadoUpdateSchema(BaseModel):
    nombre:   Optional[str]  = None
    apellido: Optional[str]  = None
    cargo:    Optional[str]  = None
    telefono: Optional[str]  = None
    email:    Optional[str]  = None
    activo:   Optional[bool] = None


class EmpleadoOutSchema(BaseModel):
    id:        int
    nombre:    str
    apellido:  str
    cargo:     str
    telefono:  Optional[str]
    email:     str
    activo:    bool
    creado_en: Optional[datetime]

    model_config = {"from_attributes": True}
