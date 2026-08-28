from sqlalchemy import Column, Integer, Float, Date, DateTime, Text, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.config.database import Base


class EstadoTorneo(str, enum.Enum):
    abierto    = "abierto"
    en_curso   = "en_curso"
    finalizado = "finalizado"
    cancelado  = "cancelado"


class TorneoModel(Base):
    __tablename__ = "torneos"

    id                 = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre             = Column(String(150), nullable=False)
    descripcion        = Column(Text)
    cancha_id          = Column(Integer, ForeignKey("canchas.id"), nullable=False)
    categoria          = Column(String(50))       # Ej: Sub-15, Libre, Mixto
    fecha_inicio       = Column(Date, nullable=False)
    fecha_fin          = Column(Date, nullable=False)
    max_equipos        = Column(Integer, nullable=False)
    precio_inscripcion = Column(Float, nullable=False)
    premio             = Column(Text)
    estado             = Column(Enum(EstadoTorneo), default=EstadoTorneo.abierto)
    creado_en          = Column(DateTime, server_default=func.now())

    # Relaciones
    cancha        = relationship("CanchaModel",           back_populates="torneos")
    inscripciones = relationship("InscripcionTorneoModel", back_populates="torneo")


class InscripcionTorneoModel(Base):
    __tablename__ = "inscripciones_torneo"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    torneo_id     = Column(Integer, ForeignKey("torneos.id"),   nullable=False)
    usuario_id    = Column(Integer, ForeignKey("usuarios.id"),  nullable=False)
    nombre_equipo = Column(String(100), nullable=False)
    creado_en     = Column(DateTime, server_default=func.now())

    # Relaciones
    torneo  = relationship("TorneoModel",  back_populates="inscripciones")
    usuario = relationship("UsuarioModel", back_populates="torneos_inscrito")
    pago    = relationship("PagoModel",    back_populates="inscripcion", uselist=False)
