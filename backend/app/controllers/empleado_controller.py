from sqlalchemy.orm import Session

from app.models.empleado_model import EmpleadoModel
from app.schemas.empleado_schema import EmpleadoSchema, EmpleadoUpdateSchema
from app.utils.response import api_response


def get_empleados(db: Session):
    empleados = db.query(EmpleadoModel).all()
    data = [
        {
            "id": e.id,
            "nombre": e.nombre,
            "apellido": e.apellido,
            "cargo": e.cargo,
            "telefono": e.telefono,
            "email": e.email,
            "activo": e.activo,
            "creado_en": str(e.creado_en) if e.creado_en else None
        }
        for e in empleados
    ]
    return api_response(True, "Lista de empleados", data=data)


def get_empleado(id: int, db: Session):
    e = db.query(EmpleadoModel).filter(EmpleadoModel.id == id).first()
    if not e:
        return api_response(False, "Empleado no encontrado", error="Not found")
    data = {
        "id": e.id, "nombre": e.nombre, "apellido": e.apellido,
        "cargo": e.cargo, "telefono": e.telefono,
        "email": e.email, "activo": e.activo
    }
    return api_response(True, "Empleado encontrado", data=data)


def create_empleado(body: EmpleadoSchema, db: Session):
    existe = db.query(EmpleadoModel).filter(EmpleadoModel.email == body.email).first()
    if existe:
        return api_response(False, "El correo ya está registrado para otro empleado", error="Duplicate")

    nuevo = EmpleadoModel(
        nombre=body.nombre,
        apellido=body.apellido,
        cargo=body.cargo,
        telefono=body.telefono,
        email=body.email
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return api_response(True, "Empleado registrado correctamente",
                        data={"id": nuevo.id, "nombre": nuevo.nombre})


def update_empleado(id: int, body: EmpleadoUpdateSchema, db: Session):
    empleado = db.query(EmpleadoModel).filter(EmpleadoModel.id == id).first()
    if not empleado:
        return api_response(False, "Empleado no encontrado", error="Not found")
    for campo, valor in body.model_dump(exclude_unset=True).items():
        setattr(empleado, campo, valor)
    db.commit()
    db.refresh(empleado)
    return api_response(True, "Empleado actualizado correctamente", data={"id": empleado.id})


def delete_empleado(id: int, db: Session):
    empleado = db.query(EmpleadoModel).filter(EmpleadoModel.id == id).first()
    if not empleado:
        return api_response(False, "Empleado no encontrado", error="Not found")
    empleado.activo = False
    db.commit()
    return api_response(True, "Empleado desactivado correctamente")
