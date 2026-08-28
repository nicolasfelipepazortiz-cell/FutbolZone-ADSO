from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.reporte_controller import (
    get_resumen_general,
    get_reservas_por_cancha,
    get_ingresos_mensuales
)
from app.utils.auth import get_admin_actual

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])

@router.get("/resumen")
def resumen(db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return get_resumen_general(db)

@router.get("/reservas-por-cancha")
def reservas_cancha(db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return get_reservas_por_cancha(db)

@router.get("/ingresos-mensuales")
def ingresos_mes(db: Session = Depends(get_db), _=Depends(get_admin_actual)):
    return get_ingresos_mensuales(db)
