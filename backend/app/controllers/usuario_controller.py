from sqlalchemy.orm import Session

from app.models.usuario_model import UsuarioModel, RolUsuario
from app.schemas.usuario_schema import UsuarioSchema, UsuarioUpdateSchema, UsuarioLoginSchema
from app.utils.auth import hash_password, verificar_password, crear_token
from app.utils.response import api_response


# ================================================
# GET ALL USUARIOS
# ================================================
def get_usuarios(db: Session):
    usuarios = db.query(UsuarioModel).all()
    data = [
        {
            "id": u.id,
            "nombre": u.nombre,
            "apellido": u.apellido,
            "email": u.email,
            "telefono": u.telefono,
            "rol": u.rol,
            "activo": u.activo,
            "creado_en": str(u.creado_en) if u.creado_en else None
        }
        for u in usuarios
    ]
    return api_response(True, "Lista de usuarios", data=data)


# ================================================
# GET USUARIO BY ID
# ================================================
def get_usuario(id: int, db: Session):
    u = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not u:
        return api_response(False, "Usuario no encontrado", error="Not found")
    data = {
        "id": u.id, "nombre": u.nombre, "apellido": u.apellido,
        "email": u.email, "telefono": u.telefono,
        "rol": u.rol, "activo": u.activo
    }
    return api_response(True, "Usuario encontrado", data=data)


# ================================================
# CLIENTES (rol=cliente)
# ================================================
def get_clientes(db: Session):
    clientes = db.query(UsuarioModel).filter(UsuarioModel.rol == RolUsuario.cliente).all()
    data = [
        {
            "id": c.id, "nombre": c.nombre, "apellido": c.apellido,
            "email": c.email, "telefono": c.telefono,
            "activo": c.activo,
            "total_reservas": len(c.reservas)
        }
        for c in clientes
    ]
    return api_response(True, "Lista de clientes", data=data)


# ================================================
# REGISTRO
# ================================================
def create_usuario(body: UsuarioSchema, db: Session):
    existe = db.query(UsuarioModel).filter(UsuarioModel.email == body.correo).first()
    if existe:
        return api_response(False, "El correo ya está registrado", error="Duplicate email")

    nuevo = UsuarioModel(
        nombre=body.nombre,
        apellido=body.apellido,
        email=body.correo,
        telefono=body.telefono,
        password_hash=hash_password(body.password),
        rol=RolUsuario.cliente
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return api_response(
        True,
        f"Usuario registrado correctamente. ¡Ya puedes iniciar sesión!",
        data={"id": nuevo.id, "nombre": nuevo.nombre, "email": nuevo.email}
    )


# ================================================
# LOGIN
# ================================================
def login_usuario(body: UsuarioLoginSchema, db: Session):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.email == body.correo).first()
    if not usuario or not verificar_password(body.password, usuario.password_hash):
        return api_response(False, "Correo o contraseña incorrectos", error="Unauthorized")
    if not usuario.activo:
        return api_response(False, "Cuenta desactivada", error="Forbidden")

    token = crear_token({"sub": usuario.id, "rol": usuario.rol, "nombre": usuario.nombre})
    return api_response(True, "Login exitoso", data={
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "email": usuario.email,
            "rol": usuario.rol
        }
    })


# ================================================
# UPDATE USUARIO
# ================================================
def update_usuario(id: int, body: UsuarioUpdateSchema, db: Session):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not usuario:
        return api_response(False, "Usuario no encontrado", error="Not found")

    cambios = body.model_dump(exclude_unset=True)
    for campo, valor in cambios.items():
        setattr(usuario, campo, valor)

    db.commit()
    db.refresh(usuario)
    return api_response(True, "Usuario actualizado correctamente",
                        data={"id": usuario.id, "nombre": usuario.nombre})


# ================================================
# DELETE USUARIO (desactivar)
# ================================================
def delete_usuario(id: int, db: Session):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not usuario:
        return api_response(False, "Usuario no encontrado", error="Not found")
    usuario.activo = False
    db.commit()
    return api_response(True, "Usuario desactivado correctamente")


# ================================================
# CAMBIAR ROL (admin puede hacer a alguien admin)
# ================================================
def cambiar_rol(id: int, rol: str, db: Session):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not usuario:
        return api_response(False, "Usuario no encontrado", error="Not found")
    if rol not in [r.value for r in RolUsuario]:
        return api_response(False, "Rol inválido", error="Bad request")
    usuario.rol = rol
    db.commit()
    return api_response(True, f"Rol actualizado a '{rol}'", data={"id": usuario.id})
