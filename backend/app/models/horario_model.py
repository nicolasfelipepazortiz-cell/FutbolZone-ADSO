from sqlalchemy import Column, Integer, String, Boolean, DateTime, Time, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.config.database import Base


class DiaSemana(str, enum.Enum):
    lunes     = "Lunes"
    martes    = "Martes"
    miercoles = "Miércoles"
    jueves    = "Jueves"
    viernes   = "Viernes"
    sabado    = "Sábado"
    domingo   = "Domingo"


class HorarioModel(Base):
    __tablename__ = "horarios"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cancha_id   = Column(Integer, ForeignKey("canchas.id"), nullable=False)
    dia         = Column(Enum(DiaSemana), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin    = Column(Time, nullable=False)
    disponible  = Column(Boolean, default=True)
    creado_en   = Column(DateTime, server_default=func.now())

    # Relaciones
    cancha = relationship("CanchaModel", back_populates="horarios")
