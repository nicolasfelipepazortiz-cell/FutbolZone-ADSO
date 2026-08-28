from sqlalchemy import Column, Integer, Float, Date, Time, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.config.database import Base


class EstadoReserva(str, enum.Enum):
    pendiente  = "pendiente"
    confirmada = "confirmada"
    cancelada  = "cancelada"
    completada = "completada"


class ReservaModel(Base):
    __tablename__ = "reservas"

    id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id     = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    cancha_id      = Column(Integer, ForeignKey("canchas.id"),  nullable=False)
    fecha          = Column(Date,  nullable=False)
    hora_inicio    = Column(Time,  nullable=False)
    hora_fin       = Column(Time,  nullable=False)
    precio_total   = Column(Float, nullable=False)
    estado         = Column(Enum(EstadoReserva), default=EstadoReserva.pendiente)
    notas          = Column(Text)
    creado_en      = Column(DateTime, server_default=func.now())
    actualizado_en = Column(DateTime, onupdate=func.now())

    # Relaciones
    usuario = relationship("UsuarioModel", back_populates="reservas")
    cancha  = relationship("CanchaModel",  back_populates="reservas")
    pago    = relationship("PagoModel",    back_populates="reserva", uselist=False)
