from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.password_reset_schema import SolicitarPinSchema, VerificarPinSchema, CambiarPasswordSchema
from app.controllers.password_reset_controller import (
    solicitar_pin,
    verificar_pin,
    cambiar_password_con_pin,
)

router = APIRouter(prefix="/api/auth/recuperar-password", tags=["Recuperación de Contraseña"])


@router.post("/solicitar-pin")
def api_solicitar_pin(body: SolicitarPinSchema, db: Session = Depends(get_db)):
    """Solicita un código PIN de 6 dígitos enviado al correo electrónico."""
    return solicitar_pin(body, db)


@router.post("/verificar-pin")
def api_verificar_pin(body: VerificarPinSchema, db: Session = Depends(get_db)):
    """Verifica si el PIN es correcto y no ha expirado."""
    return verificar_pin(body, db)


@router.post("/cambiar-password")
def api_cambiar_password(body: CambiarPasswordSchema, db: Session = Depends(get_db)):
    """Cambia la contraseña utilizando el PIN de verificación."""
    return cambiar_password_con_pin(body, db)
