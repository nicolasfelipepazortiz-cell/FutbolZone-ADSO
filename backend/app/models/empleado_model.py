from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.config.database import Base


class CargoEmpleado(str, enum.Enum):
    administrador = "Administrador"
    coordinador   = "Coordinador"
    mantenimiento = "Mantenimiento"
    atencion      = "Atención al cliente"
    seguridad     = "Seguridad"


class EmpleadoModel(Base):
    __tablename__ = "empleados"

    id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre    = Column(String(100), nullable=False)
    apellido  = Column(String(100), nullable=False)
    cargo     = Column(Enum(CargoEmpleado), nullable=False)
    telefono  = Column(String(20))
    email     = Column(String(150), unique=True, nullable=False)
    activo    = Column(Boolean, default=True)
    creado_en = Column(DateTime, server_default=func.now())
