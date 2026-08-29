import { useState, type ChangeEvent, type FormEvent } from "react";
import "./Login.css";
import { api, setAuthToken, setStoredUser } from "../services/api";
import RecuperarPasswordModal from "./RecuperarPasswordModal";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onSwitchToRegister?: () => void;
  onGoHome?: () => void;
}

function Login({ onLoginSuccess, onSwitchToRegister, onGoHome }: LoginProps) {
  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [mostrarContrasena, setMostrarContrasena] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [mostrarModalRecuperar, setMostrarModalRecuperar] = useState<boolean>(false);

  const manejarCorreo = (e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value);
  const manejarContrasena = (e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value);

  const setDemoUser = (email: string, pass: string) => {
    setCorreo(email);
    setContrasena(pass);
    setMensaje(null);
  };

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setMensaje({ texto: "Por favor ingrese correo y contraseña.", tipo: "error" });
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const res = await api.login(correo, contrasena);
      if (res.success && res.data?.access_token) {
        setAuthToken(res.data.access_token);
        setStoredUser(res.data.usuario);
        setMensaje({ texto: `¡Bienvenido de nuevo, ${res.data.usuario.nombre}!`, tipo: "exito" });
        setTimeout(() => {
          onLoginSuccess(res.data.usuario);
        }, 500);
      } else {
        setMensaje({ texto: res.message || "Credenciales incorrectas.", tipo: "error" });
      }
    } catch (err: any) {
      setMensaje({ texto: err.message || "Error al conectar con el servidor.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="fz-auth-container">
      <div className="fz-auth-phone-card">
        {/* Cabecera Oscura Curva con Avatar */}
        <div className="fz-auth-top-dark">
          {onGoHome && (
            <button type="button" className="fz-auth-btn-back" onClick={onGoHome} title="Volver al Inicio">
              ← Inicio
            </button>
          )}
          
          <div className="fz-auth-avatar-circle">
            <span className="fz-auth-avatar-icon">⚽</span>
          </div>
          <span className="fz-auth-brand-tag">FutbolZone ADSO III</span>
        </div>

        {/* Cuerpo Blanco con Formulario */}
        <div className="fz-auth-body">
          <div className="fz-auth-header-text">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus datos para gestionar y reservar canchas</p>
          </div>

          {/* Acceso Rápido 1-Clic Demo */}
          <div className="fz-demo-box">
            <span className="fz-demo-title">Acceso rápido con 1-clic:</span>
            <div className="fz-demo-btn-group">
              <button
                type="button"
                className="fz-demo-btn admin"
                onClick={() => setDemoUser("admin@futbolzone.com", "admin123")}
              >
                👑 Admin
              </button>
              <button
                type="button"
                className="fz-demo-btn cliente"
                onClick={() => setDemoUser("cliente@futbolzone.com", "cliente123")}
              >
                🏃 Cliente
              </button>
            </div>
          </div>

          <form onSubmit={manejarEnvio} className="fz-auth-form">
            <div className="fz-input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={correo}
                onChange={manejarCorreo}
                placeholder="tunombre@correo.com"
                required
              />
            </div>

            <div className="fz-input-group">
              <label>Contraseña</label>
              <div className="fz-password-wrapper">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  value={contrasena}
                  onChange={manejarContrasena}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="fz-toggle-eye"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                >
                  {mostrarContrasena ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>

              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setMostrarModalRecuperar(true)}
                  style={{ background: "none", border: "none", color: "#10b981", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                >
                  ¿Olvidaste tu contraseña? Restablécela aquí
                </button>
              </div>
            </div>

            {mensaje && (
              <div className={`fz-auth-alert ${mensaje.tipo}`}>
                {mensaje.tipo === "exito" ? "✅" : "⚠️"} {mensaje.texto}
              </div>
            )}

            <button type="submit" className="fz-btn-auth-submit" disabled={cargando}>
              {cargando ? "Iniciando sesión..." : "Ingresar a mi Cuenta"}
            </button>
          </form>

          {onSwitchToRegister && (
            <div className="fz-auth-footer">
              <p>
                ¿Aún no tienes una cuenta?{" "}
                <button type="button" className="fz-auth-link" onClick={onSwitchToRegister}>
                  Regístrate aquí
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Recuperación con PIN */}
      {mostrarModalRecuperar && (
        <RecuperarPasswordModal
          emailInicial={correo}
          onClose={() => setMostrarModalRecuperar(false)}
          onSuccessLogin={() => setMostrarModalRecuperar(false)}
        />
      )}
    </section>
  );
}

export default Login;