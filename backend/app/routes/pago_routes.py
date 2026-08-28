from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.pago_schema import PagoSchema, PagoUpdateSchema
from app.controllers.pago_controller import (
    get_pagos, get_pago, get_pagos_usuario,
    create_pago, update_pago, delete_pago, get_resumen_pagos
)
from app.utils.auth import get_admin_actual, get_usuario_actual

router = APIRouter(prefix="/api/pagos", tags=["Pagos"])

# ── Admin ─────────────────────────────────────
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return get_pagos(db)


@router.get("/resumen")
def resumen(db: Session = Depends(get_db)):
    return get_resumen_pagos(db)


@router.put("/{id}")
def actualizar(id: int, body: PagoUpdateSchema, db: Session = Depends(get_db)):
    return update_pago(id, body, db)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return delete_pago(id, db)


@router.get("/mis-pagos")
def mis_pagos(usuario_id: int, db: Session = Depends(get_db)):
    return get_pagos_usuario(usuario_id, db)


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    return get_pago(id, db)


@router.post("/")
def registrar(body: PagoSchema, db: Session = Depends(get_db)):
    return create_pago(body, db)
