import "./Navegacion.css";

interface NavegacionProps {
  usuario?: any;
  onNavigateToDashboard?: () => void;
  tema?: "claro" | "oscuro";
  onToggleTema?: () => void;
}

function Navegacion({ usuario, onNavigateToDashboard, tema = "claro", onToggleTema }: NavegacionProps) {
  return (
    <nav className="navegacion">
      <ul>
        <li>
          <a href="#inicio" className="nav-link">Inicio</a>
        </li>
        <li>
          <a href="#canchas" className="nav-link">Canchas</a>
        </li>
        <li>
          <a href="#caracteristicas" className="nav-link">Innovación & Software</a>
        </li>
        <li>
          <a href="#beneficios" className="nav-link">Beneficios</a>
        </li>
        <li>
          <a href="#ubicacion" className="nav-link">Ubicación</a>
        </li>
        {onToggleTema && (
          <li>
            <button
              type="button"
              className={`btn-theme-toggle ${tema === "oscuro" ? "dark" : ""}`}
              onClick={onToggleTema}
              title={`Cambiar a modo ${tema === "claro" ? "oscuro" : "claro"}`}
            >
              <span className="theme-icon">{tema === "claro" ? "🌙" : "☀️"}</span>
              <span className="theme-text">{tema === "claro" ? "Oscuro" : "Claro"}</span>
            </button>
          </li>
        )}
        {usuario && onNavigateToDashboard && (
          <li className="nav-dashboard-item">
            <button className="nav-dashboard-btn" onClick={onNavigateToDashboard}>
              {usuario.rol === "admin" ? "👑 Panel Admin" : "🏃 Mi Panel"}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navegacion;