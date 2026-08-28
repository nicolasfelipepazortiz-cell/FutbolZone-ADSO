from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CanchaSchema(BaseModel):
    nombre:              str
    tipo:                Optional[str] = "Fútbol 5"
    descripcion:         Optional[str] = None
    capacidad_jugadores: int           = 10
    precio_hora:         float
    tiene_iluminacion:   bool          = False
    tiene_techo:         bool          = False


class CanchaUpdateSchema(BaseModel):
    nombre:              Optional[str]   = None
    tipo:                Optional[str]   = None
    descripcion:         Optional[str]   = None
    capacidad_jugadores: Optional[int]   = None
    precio_hora:         Optional[float] = None
    tiene_iluminacion:   Optional[bool]  = None
    tiene_techo:         Optional[bool]  = None
    activa:              Optional[bool]  = None


class CanchaOutSchema(BaseModel):
    id:                  int
    nombre:              str
    tipo:                Optional[str]
    descripcion:         Optional[str]
    capacidad_jugadores: int
    precio_hora:         float
    tiene_iluminacion:   bool
    tiene_techo:         bool
    activa:              bool
    creado_en:           Optional[datetime]

    model_config = {"from_attributes": True}
