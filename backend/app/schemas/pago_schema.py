from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PagoSchema(BaseModel):
    reserva_id:     Optional[int] = None
    inscripcion_id: Optional[int] = None
    monto:          float
    metodo:         str   # efectivo | transferencia | tarjeta | nequi | daviplata
    referencia:     Optional[str] = None
    notas:          Optional[str] = None


class PagoUpdateSchema(BaseModel):
    estado:     Optional[str] = None
    referencia: Optional[str] = None
    notas:      Optional[str] = None


class PagoOutSchema(BaseModel):
    id:             int
    usuario_id:     int
    reserva_id:     Optional[int]
    inscripcion_id: Optional[int]
    monto:          float
    metodo:         str
    estado:         str
    referencia:     Optional[str]
    notas:          Optional[str]
    creado_en:      Optional[datetime]

    model_config = {"from_attributes": True}
