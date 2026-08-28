from sqlalchemy.orm import Session
from app.models.resena_model import ResenaModel
from app.models.usuario_model import UsuarioModel
from app.schemas.resena_schema import ResenaCreateSchema
from app.utils.response import api_response


def listar_resenas(db: Session, cancha_id: int = None):
    query = db.query(ResenaModel)
    if cancha_id:
        query = query.filter(ResenaModel.cancha_id == cancha_id)
    resenas = query.order_by(ResenaModel.id.desc()).all()

    data = []
    for r in resenas:
        usuario = db.query(UsuarioModel).filter(UsuarioModel.id == r.usuario_id).first()
        data.append({
            "id": r.id,
            "cancha_id": r.cancha_id,
            "usuario_id": r.usuario_id,
            "rating": r.rating,
            "comentario": r.comentario,
            "fecha": r.fecha.strftime("%Y-%m-%d %H:%M") if r.fecha else "Reciente",
            "autor": f"{usuario.nombre} {usuario.apellido}" if usuario else "Jugador Anónimo"
        })

    return api_response(success=True, message="Reseñas obtenidas correctamente", data=data)


def crear_resena(db: Session, schema: ResenaCreateSchema, usuario_id: int):
    nueva_resena = ResenaModel(
        cancha_id=schema.cancha_id,
        usuario_id=usuario_id,
        rating=schema.rating,
        comentario=schema.comentario
    )
    db.add(nueva_resena)
    db.commit()
    db.refresh(nueva_resena)

    return api_response(
        success=True,
        message="¡Gracias por calificar la cancha! Tu reseña ha sido publicada.",
        data={"id": nueva_resena.id, "rating": nueva_resena.rating, "comentario": nueva_resena.comentario}
    )
