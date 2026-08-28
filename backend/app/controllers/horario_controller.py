from sqlalchemy.orm import Session

from app.models.horario_model import HorarioModel
from app.models.cancha_model import CanchaModel
from app.schemas.horario_schema import HorarioSchema, HorarioUpdateSchema
from app.utils.response import api_response


def get_horarios(db: Session):
    horarios = db.query(HorarioModel).all()
    data = [
        {
            "id": h.id,
            "cancha_id": h.cancha_id,
            "cancha_nombre": h.cancha.nombre if h.cancha else "",
            "dia": h.dia,
            "hora_inicio": str(h.hora_inicio),
            "hora_fin": str(h.hora_fin),
            "disponible": h.disponible
        }
        for h in horarios
    ]
    return api_response(True, "Lista de horarios", data=data)


def get_horarios_cancha(cancha_id: int, db: Session):
    horarios = db.query(HorarioModel).filter(HorarioModel.cancha_id == cancha_id).all()
    data = [
        {
            "id": h.id,
            "dia": h.dia,
            "hora_inicio": str(h.hora_inicio),
            "hora_fin": str(h.hora_fin),
            "disponible": h.disponible
        }
        for h in horarios
    ]
    return api_response(True, f"Horarios de la cancha {cancha_id}", data=data)


def get_horario(id: int, db: Session):
    h = db.query(HorarioModel).filter(HorarioModel.id == id).first()
    if not h:
        return api_response(False, "Horario no encontrado", error="Not found")
    data = {
        "id": h.id, "cancha_id": h.cancha_id,
        "cancha_nombre": h.cancha.nombre if h.cancha else "",
        "dia": h.dia, "hora_inicio": str(h.hora_inicio),
        "hora_fin": str(h.hora_fin), "disponible": h.disponible
    }
    return api_response(True, "Horario encontrado", data=data)


def create_horario(body: HorarioSchema, db: Session):
    cancha = db.query(CanchaModel).filter(CanchaModel.id == body.cancha_id).first()
    if not cancha:
        return api_response(False, "Cancha no encontrada", error="Not found")

    nuevo = HorarioModel(
        cancha_id=body.cancha_id,
        dia=body.dia,
        hora_inicio=body.hora_inicio,
        hora_fin=body.hora_fin,
        disponible=body.disponible
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return api_response(True, "Horario creado correctamente", data={"id": nuevo.id})


def update_horario(id: int, body: HorarioUpdateSchema, db: Session):
    horario = db.query(HorarioModel).filter(HorarioModel.id == id).first()
    if not horario:
        return api_response(False, "Horario no encontrado", error="Not found")
    for campo, valor in body.model_dump(exclude_unset=True).items():
        setattr(horario, campo, valor)
    db.commit()
    db.refresh(horario)
    return api_response(True, "Horario actualizado correctamente", data={"id": horario.id})


def delete_horario(id: int, db: Session):
    horario = db.query(HorarioModel).filter(HorarioModel.id == id).first()
    if not horario:
        return api_response(False, "Horario no encontrado", error="Not found")
    db.delete(horario)
    db.commit()
    return api_response(True, "Horario eliminado correctamente")
