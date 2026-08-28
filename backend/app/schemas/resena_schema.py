from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ResenaCreateSchema(BaseModel):
    cancha_id: int
    rating: float = Field(..., ge=1.0, le=5.0)
    comentario: str


class ResenaResponseSchema(BaseModel):
    id: int
    cancha_id: int
    usuario_id: int
    rating: float
    comentario: str
    fecha: Optional[datetime] = None
    autor: Optional[str] = "Jugador"

    class Config:
        from_attributes = True
