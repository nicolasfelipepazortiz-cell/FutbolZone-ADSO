import { useState, useEffect } from "react";
import "./App.css";

import Navegacion from "./components/Navegacion";
import Login from "./components/Login";
import Registro from "./components/Registro";
import AcordeonCanchas from "./components/AcordeonCanchas";
import Canchas from "./components/Canchas";
import ReservaCancha from "./components/ReservaCancha";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardCliente from "./components/DashboardCliente";
import WhatsappFloat from "./components/WhatsappFloat";
import NotificacionesPill from "./components/NotificacionesPill";
import UbicacionMapa from "./components/UbicacionMapa";
import AnuncioBanner from "./components/AnuncioBanner";
import TablonRetos from "./components/TablonRetos";
import { getStoredUser, removeAuthToken } from "./services/api";

type VistaActual = "landing" | "login" | "registro" | "reserva" | "admin_dashboard" | "client_dashboard";

function App() {
  const [vista, setVista] = useState<VistaActual>("landing");
  const [usuario, setUsuario] = useState<any | null>(null);
  const [canchaParaReservar, setCanchaParaReservar] = useState<any | null>(null);

  // Estado del Anuncio Global del Admin
  const [anuncioGlobal, setAnuncioGlobal] = useState<{ titulo: string; mensaje: string; activo: boolean } | null>({
    titulo: "🔥 PROMO NOCTURNA",
    mensaje: "Aprovecha 20% de descuento en partidos nocturnos ingresando el cupón FUTBOL2026",
    activo: true,
  });

  // Estado del Tema (Modo Claro / Oscuro)
  const [tema, setTema] = useState<"claro" | "oscuro">(() => {
    return (localStorage.getItem("futbolzone_tema") as "claro" | "oscuro") || "claro";
  });

  useEffect(() => {
    const userGuardado = getStoredUser();
    if (userGuardado) {
      setUsuario(userGuardado);
    }
  }, []);

  const toggleTema = () => {
    const nuevoTema = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevoTema);
    localStorage.setItem("futbolzone_tema", nuevoTema);
  };

  const manejarLoginExitoso = (user: any) => {
    setUsuario(user);
    if (canchaParaReservar) {
      setVista("reserva");
    } else if (user.rol === "admin") {
      setVista("admin_dashboard");
    } else {
      setVista("client_dashboard");
    }
  };

  const cerrarSesion = () => {
    removeAuthToken();
    setUsuario(null);
    setCanchaParaReservar(null);
    setVista("landing");
  };

  const irADashboard = () => {
    if (!usuario) return;
    if (usuario.rol === "admin") setVista("admin_dashboard");
    else setVista("client_dashboard");
  };

  // Página independiente de Login
  if (vista === "login") {
    return (
      <Login
        onLoginSuccess={manejarLoginExitoso}
        onSwitchToRegister={() => setVista("registro")}
        onGoHome={() => setVista("landing")}
      />
    );
  }

  // Página independiente de Registro
  if (vista === "registro") {
    return (
      <Registro
        onRegisterSuccess={() => setVista("login")}
        onSwitchToLogin={() => setVista("login")}
        onGoHome={() => setVista("landing")}
      />
    );
  }

  // Página independiente de Configuración de Reserva
  if (vista === "reserva" && canchaParaReservar) {
    return (
      <ReservaCancha
        cancha={canchaParaReservar}
        onGoBack={() => {
          setCanchaParaReservar(null);
          setVista("landing");
        }}
        onReservationCreated={() => {
          setCanchaParaReservar(null);
          setVista("client_dashboard");
        }}
        onRequireLogin={() => setVista("login")}
      />
    );
  }

  // Dashboard de Admin
  if (vista === "admin_dashboard" && usuario?.rol === "admin") {
    return (
      <DashboardAdmin
        onLogout={cerrarSesion}
        onPublicarAnuncio={(nuevoAnuncio) => setAnuncioGlobal(nuevoAnuncio)}
      />
    );
  }

  // Dashboard de Cliente
  if (vista === "client_dashboard" && usuario) {
    return (
      <DashboardCliente
        usuario={usuario}
        onLogout={cerrarSesion}
        onGoToBooking={() => setVista("landing")}
      />
    );
  }

  return (
    <div className={`app-main-wrapper ${tema === "oscuro" ? "dark-mode" : ""}`}>
      {/* ANUNCIO GLOBAL DEL ADMIN */}
      <AnuncioBanner anuncio={anuncioGlobal} />

      {/* HEADER */}
      <header className="header-zone">
        <div className="logo" onClick={() => setVista("landing")} style={{ cursor: "pointer" }}>
          <h1>⚽ Futbol<span>Zone</span></h1>
        </div>

        <Navegacion
          usuario={usuario}
          onNavigateToDashboard={irADashboard}
          tema={tema}
          onToggleTema={toggleTema}
        />

        <div className="header-buttons" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Campanita de Notificaciones */}
          <NotificacionesPill onNavigate={(vistaDestino) => setVista(vistaDestino as VistaActual)} />

          {usuario ? (
            <div className="user-session-pill">
              <span className="user-name">
                {usuario.rol === "admin" ? "👑 Admin:" : "🏃"} {usuario.nombre}
              </span>
              <button className="btn btn-panel" onClick={irADashboard}>
                {usuario.rol === "admin" ? "Dashboard" : "Mis Reservas"}
              </button>
              <button className="btn btn-logout-sm" onClick={cerrarSesion} title="Cerrar Sesión">
                🔒
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-login" onClick={() => setVista("login")}>
                Iniciar Sesión
              </button>

              <button className="btn btn-register" onClick={() => setVista("registro")}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <main>
        <section id="inicio" className="banner">
          <div className="banner-content">
            <span className="banner-badge">⚽ Tu cancha, tu equipo, tu pasión</span>
            <h2>Reserva Tu Cancha Sintética En Tiempo Real</h2>
            <p>
              Canchas de Fútbol 5, 7 y 11 con iluminación LED, césped sintético de alta calidad y vestuarios de primera.
            </p>
            <div className="banner-cta-group">
              <a href="#canchas" className="btn-primary-hero">
                ⚽ ¡Reserva Tu Turno Ahora!
              </a>
              {usuario && (
                <button className="btn-secondary-hero" onClick={irADashboard}>
                  📋 Ver Mi Panel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* BARRA DE ESTADÍSTICAS RÁPIDAS */}
        <div className="hero-stats-bar">
          <div className="hero-stat-item">
            <div className="hero-stat-num">3 <span>Canchas</span></div>
            <div className="hero-stat-desc">Fútbol 5, 7 y 11 Profesionales</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">100% <span>LED</span></div>
            <div className="hero-stat-desc">Iluminación Nocturna de Estadio</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">⚡ <span>En Vivo</span></div>
            <div className="hero-stat-desc">Reserva Inmediata sin Esperas</div>
          </div>
          <div className="hero-stat-item">
            <div className="hero-stat-num">4.9 <span>★</span></div>
            <div className="hero-stat-desc">Satisfacción de Nuestros Jugadores</div>
          </div>
        </div>

        {/* ACORDEÓN DE IMÁGENES */}
        <AcordeonCanchas />

        {/* CANCHAS CON FILTRO RÁPIDO Y ESTRELLAS */}
        <Canchas
          onSelectCancha={(cancha) => {
            setCanchaParaReservar(cancha);
            setVista("reserva");
          }}
        />

        {/* TABLÓN DE RETOS / BUSCADOR DE JUGADORES */}
        <TablonRetos onRequireLogin={() => setVista("login")} />

        {/* INNOVACIÓN TECNOLÓGICA & ARQUITECTURA DEL SOFTWARE (SENA ADSO III) */}
        <section id="caracteristicas" className="section quienes-section">
          <div className="section-container">
            <span className="section-badge">💻 Proyecto Formativo · SENA ADSO III Trimestre</span>
            <h2>⚡ Innovación Tecnológica & Arquitectura del Software</h2>
            <p className="quienes-intro">
              <strong>FutbolZone</strong> es una plataforma tecnológica integral desarrollada con arquitectura moderna Full-Stack para digitalizar la administración de complejos deportivos, reservas en tiempo real, analítica ejecutiva y comunidad de jugadores.
            </p>

            {/* BADGES DEL STACK TECNOLÓGICO */}
            <div className="fz-tech-stack-row">
              <span className="fz-tech-badge">⚡ FastAPI (Python 3.14)</span>
              <span className="fz-tech-badge">⚛️ React + TypeScript</span>
              <span className="fz-tech-badge">⚡ Vite 8 Build System</span>
              <span className="fz-tech-badge">🔐 JWT + Bcrypt Hashing</span>
              <span className="fz-tech-badge">✉️ SMTP Real (Gmail OTP)</span>
              <span className="fz-tech-badge">📊 SheetJS Native Excel (.xlsx)</span>
              <span className="fz-tech-badge">🗄️ SQLAlchemy ORM</span>
            </div>

            <div className="quienes-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: "28px" }}>
              <div className="quienes-card">
                <div className="quienes-icon">⏱️</div>
                <h3>Motor de Turnos en Vivo</h3>
                <p>
                  Algoritmo inteligente de validación horaria que previene solapamientos y calcula liquidaciones dinámicas según la jornada y duración de la reserva.
                </p>
              </div>

              <div className="quienes-card">
                <div className="quienes-icon">🎟️</div>
                <h3>Tickets QR Imprimibles</h3>
                <p>
                  Generación instantánea de tickets de reserva digitales listos para imprimir o guardar en PDF con código QR de acceso rápido a la cancha.
                </p>
              </div>

              <div className="quienes-card">
                <div className="quienes-icon">📊</div>
                <h3>Reportes Nativos en Excel</h3>
                <p>
                  Exportación ejecutiva en formato <code>.xlsx</code> con fórmulas de recaudación, historial de jugadores y tablas de posiciones de torneos.
                </p>
              </div>

              <div className="quienes-card">
                <div className="quienes-icon">🔐</div>
                <h3>Seguridad OTP por Correo</h3>
                <p>
                  Restablecimiento seguro de contraseñas mediante PIN criptográfico de 6 dígitos con vigencia de 15 minutos conectado a servidores SMTP reales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS CON IMÁGENES */}
        <section id="beneficios" className="section beneficios-section">
          <div className="section-container">
            <h2>✅ Beneficios Exclusivos</h2>
            <div className="beneficios-grid">
              <div className="beneficio-card">
                <img
                  src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=500&q=80"
                  alt="Iluminación LED Nocturna"
                  className="beneficio-img"
                />
                <div className="beneficio-card-content">
                  <h3>💡 Iluminación LED Profesional</h3>
                  <p>Juega de noche con iluminación de foco LED de estadio sin sombras.</p>
                </div>
              </div>

              <div className="beneficio-card">
                <img
                  src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=500&q=80"
                  alt="Césped Sintético"
                  className="beneficio-img"
                />
                <div className="beneficio-card-content">
                  <h3>🌱 Césped Sintético Premium</h3>
                  <p>Canchas con amortiguación y fibra sintética de alta tecnología anti-impacto.</p>
                </div>
              </div>

              <div className="beneficio-card">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80"
                  alt="Vestuarios & Duchas"
                  className="beneficio-img"
                />
                <div className="beneficio-card-content">
                  <h3>🚿 Vestuarios & Duchas</h3>
                  <p>Espacios impecables y cómodos para refrescarte después de cada partido.</p>
                </div>
              </div>

              <div className="beneficio-card">
                <img
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=500&q=80"
                  alt="Parqueadero Vigilado"
                  className="beneficio-img"
                />
                <div className="beneficio-card-content">
                  <h3>🅿️ Parqueadero Vigilado</h3>
                  <p>Estacionamiento privado y seguro durante todo el tiempo de tu estadía.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UBICACIÓN Y MAPA GOOGLE MAPS */}
        <UbicacionMapa />
      </main>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <WhatsappFloat />

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <p>© 2026 FutbolZone - Proyecto Formativo.</p>
          <p>📧 nicolasfelipepazortiz@gmail.com | 📞 314-803-88-43</p>
          <p>⚽ El mejor software de gestión deportiva.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;