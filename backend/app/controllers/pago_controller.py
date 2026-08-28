from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.pago_model import PagoModel, EstadoPago
from app.models.reserva_model import ReservaModel, EstadoReserva
from app.schemas.pago_schema import PagoSchema, PagoUpdateSchema
from app.utils.response import api_response


def _pago_dict(p: PagoModel):
    return {
        "id": p.id,
        "usuario_id": p.usuario_id,
        "reserva_id": p.reserva_id,
        "inscripcion_id": p.inscripcion_id,
        "monto": p.monto,
        "metodo": p.metodo,
        "estado": p.estado,
        "referencia": p.referencia,
        "notas": p.notas,
        "creado_en": str(p.creado_en) if p.creado_en else None,
        "cliente": f"{p.usuario.nombre} {p.usuario.apellido}" if p.usuario else ""
    }


def get_pagos(db: Session):
    pagos = db.query(PagoModel).all()
    return api_response(True, "Lista de pagos", data=[_pago_dict(p) for p in pagos])


def get_pago(id: int, db: Session):
    p = db.query(PagoModel).filter(PagoModel.id == id).first()
    if not p:
        return api_response(False, "Pago no encontrado", error="Not found")
    return api_response(True, "Pago encontrado", data=_pago_dict(p))


def get_pagos_usuario(usuario_id: int, db: Session):
    pagos = db.query(PagoModel).filter(PagoModel.usuario_id == usuario_id).all()
    return api_response(True, "Mis pagos", data=[_pago_dict(p) for p in pagos])


def create_pago(body: PagoSchema, usuario_id: int, db: Session):
    if not body.reserva_id and not body.inscripcion_id:
        return api_response(False, "El pago debe estar vinculado a una reserva o inscripción")

    pago = PagoModel(
        usuario_id=usuario_id,
        reserva_id=body.reserva_id,
        inscripcion_id=body.inscripcion_id,
        monto=body.monto,
        metodo=body.metodo,
        referencia=body.referencia,
        notas=body.notas
    )
    db.add(pago)
    db.commit()
    db.refresh(pago)
    return api_response(True, "Pago registrado correctamente",
                        data={"id": pago.id, "estado": pago.estado})


def update_pago(id: int, body: PagoUpdateSchema, db: Session):
    pago = db.query(PagoModel).filter(PagoModel.id == id).first()
    if not pago:
        return api_response(False, "Pago no encontrado", error="Not found")
    for campo, valor in body.model_dump(exclude_unset=True).items():
        setattr(pago, campo, valor)

    # Si se confirma el pago → confirmar la reserva automáticamente
    if body.estado == "pagado" and pago.reserva_id:
        reserva = db.query(ReservaModel).filter(ReservaModel.id == pago.reserva_id).first()
        if reserva:
            reserva.estado = EstadoReserva.confirmada

    db.commit()
    db.refresh(pago)
    return api_response(True, "Pago actualizado correctamente",
                        data={"id": pago.id, "estado": pago.estado})


def delete_pago(id: int, db: Session):
    pago = db.query(PagoModel).filter(PagoModel.id == id).first()
    if not pago:
        return api_response(False, "Pago no encontrado", error="Not found")
    pago.estado = EstadoPago.reembolsado
    db.commit()
    return api_response(True, "Pago marcado como reembolsado")


def get_resumen_pagos(db: Session):
    total      = db.query(func.count(PagoModel.id)).scalar() or 0
    recaudado  = db.query(func.sum(PagoModel.monto)).filter(PagoModel.estado == EstadoPago.pagado).scalar() or 0
    pendientes = db.query(func.count(PagoModel.id)).filter(PagoModel.estado == EstadoPago.pendiente).scalar() or 0
    return api_response(True, "Resumen de pagos", data={
        "total_pagos": total,
        "total_recaudado": round(recaudado, 2),
        "pagos_pendientes": pendientes
    })
