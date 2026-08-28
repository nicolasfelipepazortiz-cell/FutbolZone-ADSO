"""
Script de prueba rápida para el servicio de envío de correos de FutbolZone.
Ejecuta: python test_email.py <tu_correo@ejemplo.com>
"""
import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from app.utils.email_service import send_welcome_email, SMTP_USER, SMTP_HOST, SMTP_PORT

def main():
    destinatario = sys.argv[1] if len(sys.argv) > 1 else None
    
    print("=" * 60)
    print("PROBADOR DEL SERVICIO DE CORREO - FUTBOLZONE")
    print("=" * 60)
    print(f"Servidor SMTP : {SMTP_HOST}:{SMTP_PORT}")
    print(f"Usuario SMTP  : {SMTP_USER or '(No configurado en .env)'}")
    
    if not destinatario:
        print("\n[Uso] python test_email.py <tu_correo@ejemplo.com>")
        print("Ejemplo: python test_email.py juan@gmail.com")
        sys.exit(0)
        
    print(f"\nIntentando enviar correo de prueba a '{destinatario}'...")
    resultado = send_welcome_email(destinatario, "Usuario de Prueba", "FutbolZone")
    
    if resultado:
        print("\n[EXITO] El correo fue enviado correctamente. Revisa tu bandeja de entrada o spam.")
    else:
        print("\n[INFO] No se pudo conectar al servidor SMTP.")
        print("Para enviar correos reales a bandejas de entrada, coloca tus credenciales en 'backend/.env'.")

if __name__ == "__main__":
    main()
