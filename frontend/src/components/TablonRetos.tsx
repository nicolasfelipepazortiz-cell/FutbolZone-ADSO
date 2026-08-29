import { useState, useEffect } from "react";
import "./TablonRetos.css";
import { getStoredUser } from "../services/api";

interface Convocatoria {
  id: string;
  organizador: string;
  organizadorEmail?: string;
  cancha: string;
  fecha: string;
  hora: string;
  cuposTotales: number;
  cuposOcupados: number;
  nivel: string;
  posicionBuscada: string;
  descripcion: string;
  jugadoresUnidos: string[];
}

function TablonRetos() {
  const usuario = getStoredUser();
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [filtroCancha, setFiltroCancha] = useState<string>("todas");

  // Estados para nueva convocatoria
  const [cancha, setCancha] = useState<string>("Cancha Fútbol 5");
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState<string>("19:00");
  const [cuposTotales, setCuposTotales] = useState<number>(4);
  const [posicionBuscada, setPosicionBuscada] = useState<string>("1 Arquero y 2 Defensas");
  const [nivel, setNivel] = useState<string>("Amistoso / Todos los niveles");
  const [descripcion, setDescripcion] = useState<string>("");

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = () => {
    const guardadas = localStorage.getItem("fz_convocatorias_retos");
    if (guardadas) {
      try {
        const parsed = JSON.parse(guardadas);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConvocatorias(parsed);
          return;
        }
      } catch {}
    }

    const iniciales: Convocatoria[] = [
      {
        id: "ret_1",
        organizador: "Santiago Rodríguez",
        organizadorEmail: "santiago@futbolzone.com",
        cancha: "Cancha Fútbol 5 (Central)",
        fecha: "Hoy",
        hora: "19:00 - 20:00",
        cuposTotales: 5,
        cuposOcupados: 2,
        nivel: "Amistoso / Medio",
        posicionBuscada: "1 Volante o Delantero",
        descripcion: "Nos faltan 3 jugadores para armar el 5 vs 5 de la noche. Partido con buena onda y tercer tiempo.",
        jugadoresUnidos: ["Santiago R.", "Camilo V."],
      },
      {
        id: "ret_2",
        organizador: "Mateo Gómez (Capitán)",
        organizadorEmail: "mateo@futbolzone.com",
        cancha: "Cancha Fútbol 7 (Norte)",
        fecha: "Mañana",
        hora: "20:00 - 21:00",
        cuposTotales: 7,
        cuposOcupados: 3,
        nivel: "Competitivo / Reto",
        posicionBuscada: "Arquero y 1 Lateral",
        descripcion: "Buscamos arquero fijo y lateral con buen estado físico para reto nocturno con iluminación LED.",
        jugadoresUnidos: ["Mateo G.", "Andrés C.", "Felipe P."],
      },
      {
        id: "ret_3",
        organizador: "Carlos Díaz",
        organizadorEmail: "cliente@futbolzone.com",
        cancha: "Cancha Fútbol 11 (Sur)",
        fecha: "Domingo",
        hora: "17:00 - 18:30",
        cuposTotales: 11,
        cuposOcupados: 6,
        nivel: "Amistoso / Recreativo",
        posicionBuscada: "Defensas y Mediocampistas",
        descripcion: "Partido de fin de semana en cancha reglamentaria. ¡Todos son bienvenidos a jugar!",
        jugadoresUnidos: ["Carlos D.", "Juan M.", "David R.", "Esteban S.", "Oscar L.", "Mateo T."],
      },
    ];

    setConvocatorias(iniciales);
    localStorage.setItem("fz_convocatorias_retos", JSON.stringify(iniciales));
  };

  const guardar = (nuevas: Convocatoria[]) => {
    setConvocatorias(nuevas);
    localStorage.setItem("fz_convocatorias_retos", JSON.stringify(nuevas));
  };

  const toggleUnirseAConvocatoria = (retId: string) => {
    if (!usuario) {
      alert("Por favor inicia sesión con tu cuenta para unirte a este partido.");
      return;
    }

    const miNombre = `${usuario.nombre || "Jugador"} ${usuario.apellido || ""}`.trim();

    const actualizadas = convocatorias.map((c) => {
      if (c.id === retId) {
        const yaEstaUnido = c.jugadoresUnidos.includes(miNombre);

        if (yaEstaUnido) {
          // Salir del partido (liberar cupo)
          const confirmSalida = confirm(`¿Deseas salirte de la convocatoria de ${c.organizador}? Se liberará tu cupo.`);
          if (!confirmSalida) return c;

          return {
            ...c,
            cuposOcupados: Math.max(0, c.cuposOcupados - 1),
            jugadoresUnidos: c.jugadoresUnidos.filter((j) => j !== miNombre),
          };
        } else {
          // Unirse al partido
          if (c.cuposOcupados >= c.cuposTotales) {
            alert("¡La nómina de este partido ya está completa!");
            return c;
          }

          alert(`¡Excelente ${usuario.nombre}! Te has unido al partido de ${c.organizador}. ¡Prepara los guayos! ⚽`);
          return {
            ...c,
            cuposOcupados: c.cuposOcupados + 1,
            jugadoresUnidos: [...c.jugadoresUnidos, miNombre],
          };
        }
      }
      return c;
    });

    guardar(actualizadas);
  };

  const eliminarConvocatoria = (retId: string) => {
    if (!confirm("¿Deseas eliminar esta convocatoria?")) return;
    const actualizadas = convocatorias.filter((c) => c.id !== retId);
    guardar(actualizadas);
  };

  const crearConvocatoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para publicar una convocatoria en el tablón.");
      return;
    }

    const miNombre = `${usuario.nombre || "Jugador"} ${usuario.apellido || ""}`.trim();

    const nueva: Convocatoria = {
      id: `ret_${Date.now()}`,
      organizador: miNombre,
      organizadorEmail: usuario.email || "",
      cancha,
      fecha,
      hora,
      cuposTotales: Number(cuposTotales),
      cuposOcupados: 1, // El creador ya ocupa 1 cupo
      nivel,
      posicionBuscada: posicionBuscada.trim() || "Cualquier posición",
      descripcion: descripcion.trim() || "Partido amistoso buscando jugadores con buena vibra.",
      jugadoresUnidos: [miNombre],
    };

    const actualizadas = [nueva, ...convocatorias];
    guardar(actualizadas);
    setMostrarForm(false);
    setDescripcion("");
    alert("¡Tu convocatoria ha sido publicada con éxito en el Tablón de Retos! ⚽");
  };

  const convocatoriasFiltradas = convocatorias.filter((c) => {
    if (filtroCancha === "todas") return true;
    if (filtroCancha === "f5") return c.cancha.includes("5");
    if (filtroCancha === "f7") return c.cancha.includes("7");
    if (filtroCancha === "f11") return c.cancha.includes("11");
    return true;
  });

  const miNombreUsuario = usuario ? `${usuario.nombre || "Jugador"} ${usuario.apellido || ""}`.trim() : "";

  return (
    <section id="retos" className="fz-retos-section">
      <div className="fz-retos-header">
        <span className="section-badge">👥 Comunidad FutbolZone</span>
        <h2>📢 Tablón de Retos & Buscador de Jugadores</h2>
        <p>
          ¿Te faltan jugadores para completar tu equipo? Explora los partidos abiertos con cupos disponibles o publica tu propia convocatoria.
        </p>

        <div className="fz-retos-top-actions">
          <div className="fz-retos-filters">
            <button
              type="button"
              className={`fz-filter-chip ${filtroCancha === "todas" ? "active" : ""}`}
              onClick={() => setFiltroCancha("todas")}
            >
              ⚽ Todos
            </button>
            <button
              type="button"
              className={`fz-filter-chip ${filtroCancha === "f5" ? "active" : ""}`}
              onClick={() => setFiltroCancha("f5")}
            >
              🏃 Fútbol 5
            </button>
            <button
              type="button"
              className={`fz-filter-chip ${filtroCancha === "f7" ? "active" : ""}`}
              onClick={() => setFiltroCancha("f7")}
            >
              ⚡ Fútbol 7
            </button>
            <button
              type="button"
              className={`fz-filter-chip ${filtroCancha === "f11" ? "active" : ""}`}
              onClick={() => setFiltroCancha("f11")}
            >
              🏆 Fútbol 11
            </button>
          </div>

          <button
            type="button"
            className="fz-btn-create-reto"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? "✕ Cerrar Formulario" : "➕ Publicar Convocatoria"}
          </button>
        </div>
      </div>

      {/* Formulario de Convocatoria */}
      {mostrarForm && (
        <form onSubmit={crearConvocatoria} className="fz-form-reto-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
              ⚡ Publicar Convocatoria / Búsqueda de Jugadores
            </h3>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
              👤 Publicando como: {miNombreUsuario || "Usuario"}
            </span>
          </div>

          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
            Los demás usuarios podrán ver tu partido y unirse inmediatamente con un clic.
          </p>

          <div className="fz-form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="fz-field">
              <label>Cancha *</label>
              <select value={cancha} onChange={(e) => setCancha(e.target.value)}>
                <option value="Cancha Fútbol 5 (Central)">Cancha Fútbol 5 (Central)</option>
                <option value="Cancha Fútbol 7 (Norte)">Cancha Fútbol 7 (Norte)</option>
                <option value="Cancha Fútbol 11 (Sur)">Cancha Fútbol 11 (Sur)</option>
              </select>
            </div>

            <div className="fz-field">
              <label>Fecha del Partido *</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>

            <div className="fz-field">
              <label>Horario *</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>

            <div className="fz-field">
              <label>Cupos Totales del Equipo *</label>
              <input
                type="number"
                min={2}
                max={22}
                value={cuposTotales}
                onChange={(e) => setCuposTotales(Number(e.target.value))}
                required
              />
            </div>

            <div className="fz-field">
              <label>Posición Buscada</label>
              <input
                type="text"
                placeholder="Ej: 1 Arquero, 2 Defensas"
                value={posicionBuscada}
                onChange={(e) => setPosicionBuscada(e.target.value)}
              />
            </div>

            <div className="fz-field">
              <label>Nivel de Juego</label>
              <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                <option value="Amistoso / Todos los niveles">Amistoso / Todos los niveles</option>
                <option value="Medio / Reto">Medio / Reto</option>
                <option value="Competitivo / Avanzado">Competitivo / Avanzado</option>
              </select>
            </div>
          </div>

          <div className="fz-field" style={{ marginTop: "12px" }}>
            <label>Mensaje o Reglas del Partido</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre el partido, petos, hidratación, tercer tiempo..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <button type="submit" className="fz-btn-primary">
              🚀 Publicar Convocatoria
            </button>
            <button type="button" className="fz-btn-outline" onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Grid de Retos Activos */}
      <div className="fz-retos-grid">
        {convocatoriasFiltradas.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
            <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>📭</span>
            <strong>No hay convocatorias activas para esta categoría.</strong>
            <p style={{ margin: "6px 0 14px", fontSize: "13px" }}>¡Sé el primero en crear una convocatoria y armar tu partido!</p>
            <button type="button" className="fz-btn-primary" onClick={() => setMostrarForm(true)}>
              ➕ Publicar Convocatoria
            </button>
          </div>
        ) : (
          convocatoriasFiltradas.map((c) => {
            const cuposRestantes = Math.max(0, c.cuposTotales - c.cuposOcupados);
            const lleno = cuposRestantes === 0;
            const yaUnido = miNombreUsuario && c.jugadoresUnidos.includes(miNombreUsuario);
            const esMiConvocatoria = usuario && (c.organizadorEmail === usuario.email || c.organizador === miNombreUsuario);
            const porcentajeOcupado = Math.min(100, Math.round((c.cuposOcupados / c.cuposTotales) * 100));

            return (
              <div key={c.id} className={`fz-reto-card ${lleno ? "completo" : ""} ${yaUnido ? "unido" : ""}`}>
                <div className="fz-reto-card-top">
                  <span className="fz-reto-badge-cancha">⚽ {c.cancha}</span>
                  <span className={`fz-reto-status-pill ${lleno ? "full" : "open"}`}>
                    {lleno ? "🔴 Nómina Completa" : `🟢 ${cuposRestantes} Cupos Libres`}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Organiza: {c.organizador}</h4>
                    <p className="fz-reto-datetime">
                      🗓️ {c.fecha} · ⏰ {c.hora}
                    </p>
                  </div>

                  {esMiConvocatoria && (
                    <button
                      type="button"
                      className="fz-btn-delete-reto"
                      onClick={() => eliminarConvocatoria(c.id)}
                      title="Eliminar mi convocatoria"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* BARRA DE PROGRESO DE CUPOS */}
                <div className="fz-cupos-progress-wrapper">
                  <div className="fz-cupos-labels">
                    <span>Nómina del Partido:</span>
                    <strong>{c.cuposOcupados} / {c.cuposTotales} Jugadores</strong>
                  </div>
                  <div className="fz-progress-bar-bg">
                    <div
                      className={`fz-progress-bar-fill ${lleno ? "full" : ""}`}
                      style={{ width: `${porcentajeOcupado}%` }}
                    ></div>
                  </div>
                </div>

                <div className="fz-reto-meta-box">
                  <div>
                    <span className="fz-meta-label">Buscamos:</span>
                    <strong>{c.posicionBuscada}</strong>
                  </div>
                  <div>
                    <span className="fz-meta-label">Nivel:</span>
                    <strong>{c.nivel}</strong>
                  </div>
                </div>

                <p className="fz-reto-desc">"{c.descripcion}"</p>

                {c.jugadoresUnidos.length > 0 && (
                  <div className="fz-reto-roster">
                    <span className="fz-meta-label">Jugadores Confirmados:</span>
                    <div className="fz-roster-tags">
                      {c.jugadoresUnidos.map((j, i) => (
                        <span key={i} className={`fz-player-tag ${j === miNombreUsuario ? "me" : ""}`}>
                          🏃 {j} {j === miNombreUsuario && " (Tú)"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className={`fz-btn-join-reto ${yaUnido ? "joined" : lleno ? "disabled" : ""}`}
                  onClick={() => toggleUnirseAConvocatoria(c.id)}
                  disabled={lleno && !yaUnido}
                >
                  {yaUnido
                    ? "✓ Ya estás registrado (Clic para salir)"
                    : lleno
                    ? "🔴 Nómina Completa"
                    : "⚽ ¡Me Uno al Partido!"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default TablonRetos;
