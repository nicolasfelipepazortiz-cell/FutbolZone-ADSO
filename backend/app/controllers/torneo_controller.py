from sqlalchemy.orm import Session

from app.models.torneo_model import TorneoModel, InscripcionTorneoModel, EstadoTorneo
from app.schemas.torneo_schema import TorneoSchema, TorneoUpdateSchema, InscripcionSchema
from app.utils.response import api_response


def get_torneos(db: Session):
    torneos = db.query(TorneoModel).all()
    data = [
        {
            "id": t.id,
            "nombre": t.nombre,
            "descripcion": t.descripcion,
            "cancha_id": t.cancha_id,
            "cancha_nombre": t.cancha.nombre if t.cancha else "",
            "categoria": t.categoria,
            "fecha_inicio": str(t.fecha_inicio),
            "fecha_fin": str(t.fecha_fin),
            "max_equipos": t.max_equipos,
            "precio_inscripcion": t.precio_inscripcion,
            "premio": t.premio,
            "estado": t.estado,
            "inscritos": len(t.inscripciones)
        }
        for t in torneos
    ]
    return api_response(True, "Lista de torneos", data=data)


def get_torneo(id: int, db: Session):
    t = db.query(TorneoModel).filter(TorneoModel.id == id).first()
    if not t:
        return api_response(False, "Torneo no encontrado", error="Not found")
    data = {
        "id": t.id, "nombre": t.nombre, "descripcion": t.descripcion,
        "cancha_id": t.cancha_id, "cancha_nombre": t.cancha.nombre if t.cancha else "",
        "categoria": t.categoria,
        "fecha_inicio": str(t.fecha_inicio), "fecha_fin": str(t.fecha_fin),
        "max_equipos": t.max_equipos, "precio_inscripcion": t.precio_inscripcion,
        "premio": t.premio, "estado": t.estado, "inscritos": len(t.inscripciones)
    }
    return api_response(True, "Torneo encontrado", data=data)


def create_torneo(body: TorneoSchema, db: Session):
    nuevo = TorneoModel(
        nombre=body.nombre,
        descripcion=body.descripcion,
        cancha_id=body.cancha_id,
        categoria=body.categoria,
        fecha_inicio=body.fecha_inicio,
        fecha_fin=body.fecha_fin,
        max_equipos=body.max_equipos,
        precio_inscripcion=body.precio_inscripcion,
        premio=body.premio
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return api_response(True, "Torneo creado correctamente",
                        data={"id": nuevo.id, "nombre": nuevo.nombre})


def update_torneo(id: int, body: TorneoUpdateSchema, db: Session):
    torneo = db.query(TorneoModel).filter(TorneoModel.id == id).first()
    if not torneo:
        return api_response(False, "Torneo no encontrado", error="Not found")
    for campo, valor in body.model_dump(exclude_unset=True).items():
        setattr(torneo, campo, valor)
    db.commit()
    db.refresh(torneo)
    return api_response(True, "Torneo actualizado correctamente", data={"id": torneo.id})


def delete_torneo(id: int, db: Session):
    torneo = db.query(TorneoModel).filter(TorneoModel.id == id).first()
    if not torneo:
        return api_response(False, "Torneo no encontrado", error="Not found")
    torneo.estado = EstadoTorneo.cancelado
    db.commit()
    return api_response(True, "Torneo cancelado correctamente")


def inscribir_usuario(body: InscripcionSchema, usuario_id: int, db: Session):
    torneo = db.query(TorneoModel).filter(TorneoModel.id == body.torneo_id).first()
    if not torneo:
        return api_response(False, "Torneo no encontrado", error="Not found")
    if torneo.estado != EstadoTorneo.abierto:
        return api_response(False, "El torneo no está abierto para inscripciones")
    if len(torneo.inscripciones) >= torneo.max_equipos:
        return api_response(False, "El torneo ya no tiene cupos disponibles")

    ya_inscrito = db.query(InscripcionTorneoModel).filter(
        InscripcionTorneoModel.torneo_id  == body.torneo_id,
        InscripcionTorneoModel.usuario_id == usuario_id
    ).first()
    if ya_inscrito:
        return api_response(False, "Ya estás inscrito en este torneo")

    inscripcion = InscripcionTorneoModel(
        torneo_id=body.torneo_id,
        usuario_id=usuario_id,
        nombre_equipo=body.nombre_equipo
    )
    db.add(inscripcion)
    db.commit()
    db.refresh(inscripcion)
    return api_response(True, "Inscripción exitosa", data={"id": inscripcion.id})


def get_inscripciones(torneo_id: int, db: Session):
    inscripciones = db.query(InscripcionTorneoModel).filter(
        InscripcionTorneoModel.torneo_id == torneo_id
    ).all()
    data = [
        {
            "id": i.id,
            "nombre_equipo": i.nombre_equipo,
            "usuario_id": i.usuario_id,
            "usuario_nombre": f"{i.usuario.nombre} {i.usuario.apellido}" if i.usuario else ""
        }
        for i in inscripciones
    ]
    return api_response(True, "Inscripciones del torneo", data=data)


def delete_inscripcion(id: int, db: Session):
    inscripcion = db.query(InscripcionTorneoModel).filter(InscripcionTorneoModel.id == id).first()
    if not inscripcion:
        return api_response(False, "Inscripción no encontrada", error="Not found")
    db.delete(inscripcion)
    db.commit()
    return api_response(True, "Inscripción cancelada correctamente")
