from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "data":    None,
            "error":   f"HTTP {exc.status_code}"
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errores = []
    for error in exc.errors():
        campo = " -> ".join(str(e) for e in error["loc"])
        errores.append(f"{campo}: {error['msg']}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Error de validación en los datos enviados",
            "data":    None,
            "error":   errores
        }
    )


async def internal_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Error interno del servidor",
            "data":    None,
            "error":   str(exc)
        }
    )
