from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UsuarioSchema(BaseModel):
    nombre:   str
    apellido: str
    correo:   str
    password: str
    telefono: Optional[str] = None


class UsuarioLoginSchema(BaseModel):
    correo:   str
    password: str


class UsuarioUpdateSchema(BaseModel):
    nombre:   Optional[str]  = None
    apellido: Optional[str]  = None
    telefono: Optional[str]  = None
    activo:   Optional[bool] = None


class UsuarioOutSchema(BaseModel):
    id:        int
    nombre:    str
    apellido:  str
    correo:    str
    telefono:  Optional[str]
    rol:       str
    activo:    bool
    creado_en: Optional[datetime]

    model_config = {"from_attributes": True}
