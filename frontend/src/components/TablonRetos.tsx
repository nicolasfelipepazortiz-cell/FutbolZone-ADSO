import { useState, useEffect } from "react";
import "./TablonRetos.css";
import { getStoredUser } from "../services/api";

interface Convocatoria {
  id: string;
  organizador: string;
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

  // Estados para nueva convocatoria
  const [cancha, setCancha] = useState<string>("Cancha Fútbol 5");
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState<string>("19:00");
  const [cuposTotales, setCuposTotales] = useState<number>(2);
  const [posicionBuscada, setPosicionBuscada] = useState<string>("Defensa / Volante");
  const [nivel, setNivel] = useState<string>("Amistoso / Todos los niveles");
  const [descripcion, setDescripcion] = useState<string>("");

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = () => {
    const guardadas = localStorage.getItem("fz_convocatorias_retos");
    if (guardadas) {
      try {
        setConvocatorias(JSON.parse(guardadas));
        return;
      } catch {}
    }

    const iniciales: Convocatoria[] = [
      {
        id: "ret_1",
        organizador: "Santiago Rodríguez",
        cancha: "Cancha Central (F5)",
        fecha: "Hoy",
        hora: "19:00 - 20:00",
        cuposTotales: 2,
        cuposOcupados: 1,
        nivel: "Amistoso / Medio",
        posicionBuscada: "1 Volante o Delantero",
        descripcion: "Nos falta 1 jugador para armar el 5 vs 5 de la noche. Partido con buena onda y tercer tiempo.",
        jugadoresUnidos: ["Santiago R."],
      },
      {
        id: "ret_2",
        organizador: "Mateo Gómez (Capitán)",
        cancha: "Cancha Norte (F7)",
        fecha: "Mañana",
        hora: "20:00 - 21:00",
        cuposTotales: 3,
        cuposOcupados: 2,
        nivel: "Competitivo / Reto",
        posicionBuscada: "Arquero y 1 Lateral",
        descripcion: "Buscamos arquero fijo y lateral con buen físico para reto nocturno con luces LED.",
        jugadoresUnidos: ["Mateo G.", "Andrés C."],
      },
    ];

    setConvocatorias(iniciales);
    localStorage.setItem("fz_convocatorias_retos", JSON.stringify(iniciales));
  };

  const guardar = (nuevas: Convocatoria[]) => {
    setConvocatorias(nuevas);
    localStorage.setItem("fz_convocatorias_retos", JSON.stringify(nuevas));
  };

  const unirseAConvocatoria = (retId: string) => {
    if (!usuario) {
      alert("Por favor inicia sesión para unirte a este partido.");
      return;
    }

    const nombreJugador = `${usuario.nombre} ${usuario.apellido || ""}`.trim();

    const actualizadas = convocatorias.map((c) => {
      if (c.id === retId) {
        if (c.jugadoresUnidos.includes(nombreJugador)) {
          alert("Ya estás registrado en esta convocatoria.");
          return c;
        }
        if (c.cuposOcupados >= c.cuposTotales) {
          alert("¡La nómina ya está completa!");
          return c;
        }
        alert(`¡Genial ${usuario.nombre}! Te has unido al partido de ${c.organizador}. ¡Prepara los guayos! ⚽`);
        return {
          ...c,
          cuposOcupados: c.cuposOcupados + 1,
          jugadoresUnidos: [...c.jugadoresUnidos, nombreJugador],
        };
      }
      return c;
    });

    guardar(actualizadas);
  };

  const crearConvocatoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para publicar una convocatoria.");
      return;
    }

    const nueva: Convocatoria = {
      id: `ret_${Date.now()}`,
      organizador: `${usuario.nombre} ${usuario.apellido || ""}`.trim(),
      cancha,
      fecha,
      hora,
      cuposTotales: Number(cuposTotales),
      cuposOcupados: 0,
      nivel,
      posicionBuscada,
      descripcion: descripcion || "Partido amistoso buscando completar equipo.",
      jugadoresUnidos: [],
    };

    const actualizadas = [nueva, ...convocatorias];
    guardar(actualizadas);
    setMostrarForm(false);
    setDescripcion("");
    alert("¡Convocatoria publicada en el Tablón de Retos!");
  };

  return (
    <section id="retos" className="fz-retos-section">
      <div className="fz-retos-header">
        <span className="section-badge">👥 Comunidad FutbolZone</span>
        <h2>📢 Tablón de Retos & Buscador de Jugadores</h2>
        <p>¿Te faltan jugadores para completar tu equipo? Únete a un partido abierto o publica tu propia convocatoria.</p>

        <div style={{ marginTop: "14px" }}>
          <button
            type="button"
            className="fz-btn-create-reto"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? "✕ Cancelar" : "+ Publicar Convocatoria de Partido"}
          </button>
        </div>
      </div>

      {/* Formulario de Convocatoria */}
      {mostrarForm && (
        <form onSubmit={crearConvocatoria} className="fz-form-reto-card">
          <h3>⚡ Publicar Convocatoria / Búsqueda de Jugadores</h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
            Los demás usuarios podrán ver tu publicación y unirse con un solo clic.
          </p>

          <div className="fz-form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="fz-field">
              <label>Cancha *</label>
              <select value={cancha} onChange={(e) => setCancha(e.target.value)}>
                <option value="Cancha Fútbol 5">Cancha Central (F5)</option>
                <option value="Cancha Fútbol 7">Cancha Norte (F7)</option>
                <option value="Cancha Fútbol 11">Cancha Sur (F11)</option>
              </select>
            </div>

            <div className="fz-field">
              <label>Fecha *</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>

            <div className="fz-field">
              <label>Horario *</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>

            <div className="fz-field">
              <label>¿Cuántos jugadores faltan? *</label>
              <input
                type="number"
                min={1}
                max={10}
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
            <label>Mensaje para la comunidad</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre el partido, vestuarios, tercer tiempo..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <button type="submit" className="fz-btn-primary">
              Publicar Convocatoria
            </button>
            <button type="button" className="fz-btn-outline" onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Grid de Retos Activos */}
      <div className="fz-retos-grid">
        {convocatorias.map((c) => {
          const cuposRestantes = Math.max(0, c.cuposTotales - c.cuposOcupados);
          const lleno = cuposRestantes === 0;

          return (
            <div key={c.id} className={`fz-reto-card ${lleno ? "completo" : ""}`}>
              <div className="fz-reto-card-top">
                <span className="fz-reto-badge-cancha">⚽ {c.cancha}</span>
                <span className={`fz-reto-status-pill ${lleno ? "full" : "open"}`}>
                  {lleno ? "🔴 Nómina Completa" : `🟢 ${cuposRestantes} Cupos Libres`}
                </span>
              </div>

              <h4>Organiza: {c.organizador}</h4>
              <p className="fz-reto-datetime">
                🗓️ {c.fecha} · ⏰ {c.hora}
              </p>

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
                      <span key={i} className="fz-player-tag">
                        🏃 {j}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`fz-btn-join-reto ${lleno ? "disabled" : ""}`}
                disabled={lleno}
                onClick={() => unirseAConvocatoria(c.id)}
              >
                {lleno ? "Partido Completo" : "⚽ ¡Me Uno al Partido!"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TablonRetos;
