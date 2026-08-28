import { useState, type FormEvent } from "react";
import "./Registro.css";
import { api } from "../services/api";

interface RegistroProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onGoHome?: () => void;
}

function Registro({ onRegisterSuccess, onSwitchToLogin, onGoHome }: RegistroProps) {
  const [nombre, setNombre] = useState<string>("" );
  const [apellido, setApellido] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  // Calcular la fortaleza de la contraseña en tiempo real
  const calcularFortaleza = (pass: string, tel: string) => {
    if (!pass) return { porcentaje: 0, color: "#cbd5e1", label: "" };
    
    let score = 0;
    if (pass.length >= 8) score += 35;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 30;

    // Penalización si incluye el teléfono
    if (tel && tel.length >= 4 && pass.includes(tel)) {
      score = 10;
    }

    if (score < 40 || pass.length < 8) {
      return { porcentaje: 33, color: "#ef4444", label: "🔴 Débil" };
    } else if (score < 75) {
      return { porcentaje: 66, color: "#f59e0b", label: "🟡 Media" };
    } else {
      return { porcentaje: 100, color: "#10b981", label: "🟢 Segura" };
    }
  };

  const fortaleza = calcularFortaleza(password, telefono);

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !apellido || !correo || !password || !confirmPassword) {
      setMensaje({ texto: "Por favor complete los campos obligatorios.", tipo: "error" });
      return;
    }

    // 1. Validar coincidencia de contraseñas
    if (password !== confirmPassword) {
      setMensaje({ texto: "Las contraseñas no coinciden. Verifícalas.", tipo: "error" });
      return;
    }

    // 2. Validar longitud mínima de 8 caracteres
    if (password.length < 8) {
      setMensaje({ texto: "La contraseña debe tener al menos 8 caracteres.", tipo: "error" });
      return;
    }

    // 3. Validar carácter especial
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!tieneCaracterEspecial) {
      setMensaje({
        texto: "La contraseña debe incluir al menos un carácter especial (ej. @, #, $, %, !).",
        tipo: "error",
      });
      return;
    }

    // 4. Validar que no sea el teléfono registrado
    if (telefono && (password === telefono || password.includes(telefono))) {
      setMensaje({
        texto: "La contraseña no puede ser igual ni contener tu número de teléfono.",
        tipo: "error",
      });
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const res = await api.registro({
        nombre,
        apellido,
        correo,
        telefono,
        password,
      });

      if (res.success) {
        setMensaje({
          texto: "¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.",
          tipo: "exito",
        });
        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
          else if (onSwitchToLogin) onSwitchToLogin();
        }, 1500);
      } else {
        setMensaje({ texto: res.message || "Error al registrar usuario.", tipo: "error" });
      }
    } catch (err: any) {
      setMensaje({ texto: err.message || "Ocurrió un error en el registro.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="fz-auth-container">
      <div className="fz-auth-phone-card fz-reg-card">
        {/* Cabecera Oscura Curva */}
        <div className="fz-auth-top-dark">
          {onGoHome && (
            <button type="button" className="fz-auth-btn-back" onClick={onGoHome} title="Volver al Inicio">
              ← Inicio
            </button>
          )}

          <div className="fz-auth-avatar-circle">
            <span className="fz-auth-avatar-icon">⚽</span>
          </div>
          <span className="fz-auth-brand-tag">Crear Cuenta</span>
        </div>

        {/* Cuerpo Blanco del Formulario */}
        <div className="fz-auth-body">
          <div className="fz-auth-header-text">
            <h2>Únete a FutbolZone</h2>
            <p>Regístrate para reservar canchas y armar tus partidos</p>
          </div>

          <form onSubmit={manejarEnvio} className="fz-auth-form">
            <div className="fz-form-row-2">
              <div className="fz-input-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="fz-input-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            <div className="fz-form-row-2">
              <div className="fz-input-group">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="juan@correo.com"
                  required
                />
              </div>
              <div className="fz-input-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="3001234567"
                />
              </div>
            </div>

            <div className="fz-form-row-2">
              <div className="fz-input-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>
              <div className="fz-input-group">
                <label>Confirmar Contraseña *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
            </div>

            {/* Barra de Fortaleza */}
            {password && (
              <div className="fz-strength-box">
                <div className="fz-strength-track">
                  <div
                    className="fz-strength-fill"
                    style={{
                      width: `${fortaleza.porcentaje}%`,
                      backgroundColor: fortaleza.color,
                    }}
                  ></div>
                </div>
                <span className="fz-strength-label" style={{ color: fortaleza.color }}>
                  Seguridad: {fortaleza.label}
                </span>
              </div>
            )}

            <div className="fz-rules-badge">
              💡 Mínimo 8 caracteres y 1 símbolo (@, #, $, %).
            </div>

            {mensaje && (
              <div className={`fz-auth-alert ${mensaje.tipo}`}>
                {mensaje.tipo === "exito" ? "✅" : "⚠️"} {mensaje.texto}
              </div>
            )}

            <button type="submit" className="fz-btn-auth-submit" disabled={cargando}>
              {cargando ? "Creando cuenta..." : "Completar Registro"}
            </button>
          </form>

          {onSwitchToLogin && (
            <div className="fz-auth-footer">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <button type="button" className="fz-auth-link" onClick={onSwitchToLogin}>
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Registro;