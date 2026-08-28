import { useState, useEffect } from "react";
import "./NotificacionesPill.css";
import { getStoredUser } from "../services/api";

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: "reserva" | "sistema" | "promocion" | "pago";
  accionVista?: "landing" | "admin_dashboard" | "client_dashboard" | "reserva";
}

interface NotificacionesPillProps {
  onNavigate?: (vista: string) => void;
}

function NotificacionesPill({ onNavigate }: NotificacionesPillProps) {
  const [abierto, setAbierto] = useState<boolean>(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const usuario = getStoredUser();

  useEffect(() => {
    cargarNotificaciones();
  }, [usuario?.id, usuario?.rol]);

  const cargarNotificaciones = async () => {
    const claveStorage = `fz_notifs_${usuario?.id || "guest"}`;
    const guardadas = localStorage.getItem(claveStorage);

    if (guardadas) {
      try {
        setNotificaciones(JSON.parse(guardadas));
        return;
      } catch {
        // Fallback si hay error de parseo
      }
    }

    // Generar notificaciones iniciales dinámicas y útiles según el rol
    let iniciales: Notificacion[] = [];

    if (usuario?.rol === "admin") {
      iniciales = [
        {
          id: "notif_adm_1",
          titulo: "⚡ Panel de Administración Activo",
          mensaje: "Todas las canchas (F5, F7 y F11) están sincronizadas y listas para operar.",
          fecha: "Ahora mismo",
          leida: false,
          tipo: "sistema",
          accionVista: "admin_dashboard",
        },
        {
          id: "notif_adm_2",
          titulo: "📅 Control de Reservas en Vivo",
          mensaje: "Tienes turnos agendados pendientes por confirmar o completar en el panel.",
          fecha: "Hace 10 min",
          leida: false,
          tipo: "reserva",
          accionVista: "admin_dashboard",
        },
        {
          id: "notif_adm_3",
          titulo: "📢 Aviso Promocional Activo",
          mensaje: "El banner de promo en vivo está visible para todos los usuarios en la web.",
          fecha: "Hoy",
          leida: true,
          tipo: "promocion",
          accionVista: "admin_dashboard",
        },
      ];
    } else if (usuario) {
      iniciales = [
        {
          id: "notif_cli_1",
          titulo: "⚽ ¡Bienvenido a FutbolZone!",
          mensaje: `Hola ${usuario.nombre}, explora nuestras canchas sintéticas y agenda tu partido en tiempo real.`,
          fecha: "Ahora",
          leida: false,
          tipo: "sistema",
          accionVista: "client_dashboard",
        },
        {
          id: "notif_cli_2",
          titulo: "🔥 Cupón de Descuento Disponible",
          mensaje: "Usa el código SENA20 en tu próxima reserva para obtener 20% OFF en la tarifa.",
          fecha: "Hoy",
          leida: false,
          tipo: "promocion",
          accionVista: "landing",
        },
        {
          id: "notif_cli_3",
          titulo: "💡 Recordatorio de Cancha",
          mensaje: "Llega 15 minutos antes de tu partido con tu equipo para usar los vestuarios.",
          fecha: "Ayer",
          leida: true,
          tipo: "reserva",
          accionVista: "client_dashboard",
        },
      ];
    } else {
      iniciales = [
        {
          id: "notif_gst_1",
          titulo: "⚽ Reserva Tu Cancha en Tiempo Real",
          mensaje: "Canchas de Fútbol 5, 7 y 11 con iluminación LED profesional y vestuarios.",
          fecha: "Ahora",
          leida: false,
          tipo: "sistema",
          accionVista: "landing",
        },
        {
          id: "notif_gst_2",
          titulo: "🔥 Promo de Bienvenida",
          mensaje: "Regístrate gratis hoy y reserva canchas sin filas ni llamadas.",
          fecha: "Hoy",
          leida: false,
          tipo: "promocion",
          accionVista: "landing",
        },
      ];
    }

    setNotificaciones(iniciales);
    localStorage.setItem(claveStorage, JSON.stringify(iniciales));
  };

  const guardarNotifs = (nuevas: Notificacion[]) => {
    setNotificaciones(nuevas);
    const claveStorage = `fz_notifs_${usuario?.id || "guest"}`;
    localStorage.setItem(claveStorage, JSON.stringify(nuevas));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarTodasLeidas = () => {
    const actualizadas = notificaciones.map((n) => ({ ...n, leida: true }));
    guardarNotifs(actualizadas);
  };

  const limpiarNotificaciones = () => {
    guardarNotifs([]);
  };

  const hacerClicNotif = (notif: Notificacion) => {
    const actualizadas = notificaciones.map((n) =>
      n.id === notif.id ? { ...n, leida: true } : n
    );
    guardarNotifs(actualizadas);
    setAbierto(false);

    if (notif.accionVista && onNavigate) {
      onNavigate(notif.accionVista);
    }
  };

  return (
    <div className="fz-notif-wrapper">
      <button
        type="button"
        className={`fz-btn-bell ${noLeidas > 0 ? "has-unread" : ""}`}
        onClick={() => {
          setAbierto(!abierto);
        }}
        title={`Notificaciones (${noLeidas} no leídas)`}
      >
        <span className={`fz-bell-icon ${noLeidas > 0 ? "ringing" : ""}`}>🔔</span>
        {noLeidas > 0 && <span className="fz-bell-badge">{noLeidas}</span>}
      </button>

      {abierto && (
        <div className="fz-notif-dropdown">
          <div className="fz-notif-header">
            <div className="fz-notif-header-title">
              <h4>🔔 Notificaciones</h4>
              {noLeidas > 0 && <span className="fz-notif-unread-tag">{noLeidas} nuevas</span>}
            </div>
            <div className="fz-notif-header-actions">
              {noLeidas > 0 && (
                <button
                  type="button"
                  className="fz-btn-mark-all"
                  onClick={marcarTodasLeidas}
                  title="Marcar todas como leídas"
                >
                  ✓ Leídas
                </button>
              )}
              <button
                type="button"
                className="fz-btn-close-notif"
                onClick={() => setAbierto(false)}
                title="Cerrar panel"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="fz-notif-list">
            {notificaciones.length === 0 ? (
              <div className="fz-notif-empty">
                <span>📭</span>
                <p>No tienes notificaciones pendientes</p>
              </div>
            ) : (
              notificaciones.map((n) => (
                <div
                  key={n.id}
                  className={`fz-notif-item ${n.leida ? "leida" : "unread"}`}
                  onClick={() => hacerClicNotif(n)}
                >
                  <div className="fz-notif-item-top">
                    <span className={`fz-notif-type-tag ${n.tipo}`}>
                      {n.tipo === "reserva" && "⚽ Reserva"}
                      {n.tipo === "sistema" && "💡 Sistema"}
                      {n.tipo === "promocion" && "🔥 Promo"}
                      {n.tipo === "pago" && "💵 Pago"}
                    </span>
                    <span className="fz-notif-time">{n.fecha}</span>
                  </div>
                  <strong className="fz-notif-item-title">{n.titulo}</strong>
                  <p className="fz-notif-item-msg">{n.mensaje}</p>
                </div>
              ))
            )}
          </div>

          {notificaciones.length > 0 && (
            <div className="fz-notif-footer">
              <button
                type="button"
                className="fz-btn-clear-notifs"
                onClick={limpiarNotificaciones}
              >
                🗑️ Limpiar todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificacionesPill;
