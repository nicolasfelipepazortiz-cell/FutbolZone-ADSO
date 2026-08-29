from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.config.database import Base


class PasswordResetPinModel(Base):
    __tablename__ = "password_reset_pins"

    id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email     = Column(String(150), nullable=False, index=True)
    pin       = Column(String(6), nullable=False)
    expira_en = Column(DateTime, nullable=False)
    usado     = Column(Boolean, default=False)
    creado_en = Column(DateTime, server_default=func.now())
