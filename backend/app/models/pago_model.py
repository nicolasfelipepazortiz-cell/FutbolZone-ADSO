from sqlalchemy import Column, Integer, Float, DateTime, Text, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.config.database import Base


class EstadoPago(str, enum.Enum):
    pendiente   = "pendiente"
    pagado      = "pagado"
    fallido     = "fallido"
    reembolsado = "reembolsado"


class MetodoPago(str, enum.Enum):
    efectivo      = "efectivo"
    transferencia = "transferencia"
    tarjeta       = "tarjeta"
    nequi         = "nequi"
    daviplata     = "daviplata"


class PagoModel(Base):
    __tablename__ = "pagos"

    id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_id     = Column(Integer, ForeignKey("usuarios.id"),              nullable=False)
    reserva_id     = Column(Integer, ForeignKey("reservas.id"),              nullable=True)
    inscripcion_id = Column(Integer, ForeignKey("inscripciones_torneo.id"),  nullable=True)
    monto          = Column(Float, nullable=False)
    metodo         = Column(Enum(MetodoPago), nullable=False)
    estado         = Column(Enum(EstadoPago), default=EstadoPago.pendiente)
    referencia     = Column(String(100))
    notas          = Column(Text)
    creado_en      = Column(DateTime, server_default=func.now())

    # Relaciones
    usuario     = relationship("UsuarioModel",          back_populates="pagos")
    reserva     = relationship("ReservaModel",          back_populates="pago")
    inscripcion = relationship("InscripcionTorneoModel", back_populates="pago")
