from pydantic import BaseModel, EmailStr, Field


class SolicitarPinSchema(BaseModel):
    email: EmailStr


class VerificarPinSchema(BaseModel):
    email: EmailStr
    pin: str = Field(..., min_length=6, max_length=6, description="Código PIN de 6 dígitos")


class CambiarPasswordSchema(BaseModel):
    email: EmailStr
    pin: str = Field(..., min_length=6, max_length=6, description="Código PIN de 6 dígitos")
    nueva_password: str = Field(..., min_length=6, description="Nueva contraseña segura")
