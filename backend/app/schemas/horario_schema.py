from pydantic import BaseModel
from typing import Optional
from datetime import datetime, time


class HorarioSchema(BaseModel):
    cancha_id:   int
    dia:         str   # Lunes | Martes | Miércoles | ...
    hora_inicio: time
    hora_fin:    time
    disponible:  bool = True


class HorarioUpdateSchema(BaseModel):
    dia:         Optional[str]  = None
    hora_inicio: Optional[time] = None
    hora_fin:    Optional[time] = None
    disponible:  Optional[bool] = None


class HorarioOutSchema(BaseModel):
    id:          int
    cancha_id:   int
    dia:         str
    hora_inicio: time
    hora_fin:    time
    disponible:  bool
    creado_en:   Optional[datetime]

    model_config = {"from_attributes": True}
