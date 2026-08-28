from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class TorneoSchema(BaseModel):
    nombre:             str
    descripcion:        Optional[str]   = None
    cancha_id:          int
    categoria:          Optional[str]   = None
    fecha_inicio:       date
    fecha_fin:          date
    max_equipos:        int
    precio_inscripcion: float
    premio:             Optional[str]   = None


class TorneoUpdateSchema(BaseModel):
    nombre:             Optional[str]   = None
    descripcion:        Optional[str]   = None
    categoria:          Optional[str]   = None
    fecha_inicio:       Optional[date]  = None
    fecha_fin:          Optional[date]  = None
    max_equipos:        Optional[int]   = None
    precio_inscripcion: Optional[float] = None
    premio:             Optional[str]   = None
    estado:             Optional[str]   = None


class TorneoOutSchema(BaseModel):
    id:                 int
    nombre:             str
    descripcion:        Optional[str]
    cancha_id:          int
    categoria:          Optional[str]
    fecha_inicio:       date
    fecha_fin:          date
    max_equipos:        int
    precio_inscripcion: float
    premio:             Optional[str]
    estado:             str
    creado_en:          Optional[datetime]

    model_config = {"from_attributes": True}


class InscripcionSchema(BaseModel):
    torneo_id:    int
    nombre_equipo: str


class InscripcionOutSchema(BaseModel):
    id:            int
    torneo_id:     int
    usuario_id:    int
    nombre_equipo: str
    creado_en:     Optional[datetime]

    model_config = {"from_attributes": True}
