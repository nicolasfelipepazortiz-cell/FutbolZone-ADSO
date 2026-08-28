from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class ResenaModel(Base):
    __tablename__ = "resenas"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cancha_id  = Column(Integer, ForeignKey("canchas.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    rating     = Column(Float, nullable=False, default=5.0)  # 1.0 a 5.0 estrellas
    comentario = Column(Text, nullable=False)
    fecha      = Column(DateTime, server_default=func.now())

    # Relaciones
    cancha  = relationship("CanchaModel", back_populates="resenas")
    usuario = relationship("UsuarioModel")
