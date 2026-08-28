from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.usuario_model import UsuarioModel, RolUsuario
from app.models.cancha_model import CanchaModel
from app.models.reserva_model import ReservaModel, EstadoReserva
from app.models.pago_model import PagoModel, EstadoPago
from app.models.torneo_model import TorneoModel
from app.utils.response import api_response


def get_resumen_general(db: Session):
    """Dashboard admin: totales generales"""
    total_usuarios   = db.query(func.count(UsuarioModel.id)).scalar() or 0
    total_clientes   = db.query(func.count(UsuarioModel.id)).filter(UsuarioModel.rol == RolUsuario.cliente).scalar() or 0
    total_canchas    = db.query(func.count(CanchaModel.id)).filter(CanchaModel.activa == True).scalar() or 0
    total_reservas   = db.query(func.count(ReservaModel.id)).scalar() or 0
    reservas_activas = db.query(func.count(ReservaModel.id)).filter(
        ReservaModel.estado.in_([EstadoReserva.pendiente, EstadoReserva.confirmada])
    ).scalar() or 0
    total_recaudado  = db.query(func.sum(PagoModel.monto)).filter(PagoModel.estado == EstadoPago.pagado).scalar() or 0
    torneos_activos  = db.query(func.count(TorneoModel.id)).filter(
        TorneoModel.estado.in_(["abierto", "en_curso"])
    ).scalar() or 0

    return api_response(True, "Resumen general", data={
        "total_usuarios":   total_usuarios,
        "total_clientes":   total_clientes,
        "total_canchas":    total_canchas,
        "total_reservas":   total_reservas,
        "reservas_activas": reservas_activas,
        "total_recaudado":  round(total_recaudado, 2),
        "torneos_activos":  torneos_activos
    })


def get_reservas_por_cancha(db: Session):
    """Reporte: cuántas reservas tiene cada cancha"""
    resultado = db.query(
        CanchaModel.nombre,
        func.count(ReservaModel.id).label("total_reservas"),
        func.sum(ReservaModel.precio_total).label("ingresos")
    ).outerjoin(ReservaModel, ReservaModel.cancha_id == CanchaModel.id)\
     .filter(CanchaModel.activa == True)\
     .group_by(CanchaModel.id, CanchaModel.nombre)\
     .all()

    data = [
        {
            "cancha": row.nombre,
            "total_reservas": row.total_reservas or 0,
            "ingresos": round(row.ingresos or 0, 2)
        }
        for row in resultado
    ]
    return api_response(True, "Reservas por cancha", data=data)


def get_ingresos_mensuales(db: Session):
    """Reporte: ingresos agrupados por mes"""
    resultado = db.query(
        func.year(PagoModel.creado_en).label("anio"),
        func.month(PagoModel.creado_en).label("mes"),
        func.sum(PagoModel.monto).label("total")
    ).filter(PagoModel.estado == EstadoPago.pagado)\
     .group_by(func.year(PagoModel.creado_en), func.month(PagoModel.creado_en))\
     .order_by(func.year(PagoModel.creado_en), func.month(PagoModel.creado_en))\
     .all()

    meses = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
             "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    data = [
        {
            "periodo": f"{meses[row.mes]} {row.anio}",
            "total": round(row.total or 0, 2)
        }
        for row in resultado
    ]
    return api_response(True, "Ingresos mensuales", data=data)
