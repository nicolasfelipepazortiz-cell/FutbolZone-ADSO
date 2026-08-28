import { useState, useEffect } from "react";
import "./TorneosView.css";
import { getStoredUser } from "../services/api";

interface EquipoTabla {
  id: number;
  nombre: string;
  puntos: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
}

interface PartidoFixture {
  id: number;
  fecha: string;
  hora: string;
  equipoLocal: string;
  equipoVisita: string;
  golesLocal: number | null;
  golesVisita: number | null;
  jugado: boolean;
}

function TorneosView() {
  const usuario = getStoredUser();
  const esAdmin = usuario?.rol === "admin";

  const [tabTorneo, setTabTorneo] = useState<"posiciones" | "fixture" | "inscripcion">("posiciones");

  // Tabla de posiciones reactiva
  const [tablaPosiciones, setTablaPosiciones] = useState<EquipoTabla[]>([
    { id: 1, nombre: "Los Galácticos F.C.", puntos: 15, pj: 5, pg: 5, pe: 0, pp: 0, gf: 18, gc: 4, dg: 14 },
    { id: 2, nombre: "Depor Bogotá", puntos: 12, pj: 5, pg: 4, pe: 0, pp: 1, gf: 14, gc: 7, dg: 7 },
    { id: 3, nombre: "Atlético SENA", puntos: 9, pj: 5, pg: 3, pe: 0, pp: 2, gf: 11, gc: 9, dg: 2 },
    { id: 4, nombre: "Inter de Amigos", puntos: 6, pj: 5, pg: 2, pe: 0, pp: 3, gf: 8, gc: 12, dg: -4 },
    { id: 5, nombre: "Real Chapinero", puntos: 3, pj: 5, pg: 1, pe: 0, pp: 4, gf: 6, gc: 15, dg: -9 },
    { id: 6, nombre: "La Naranja Mecánica", puntos: 0, pj: 5, pg: 0, pe: 0, pp: 5, gf: 3, gc: 13, dg: -10 },
  ]);

  // Fixture de partidos
  const [fixture, setFixture] = useState<PartidoFixture[]>([
    { id: 101, fecha: "Viernes 28 Ago", hora: "19:00", equipoLocal: "Los Galácticos F.C.", equipoVisita: "Depor Bogotá", golesLocal: 3, golesVisita: 2, jugado: true },
    { id: 102, fecha: "Viernes 28 Ago", hora: "20:00", equipoLocal: "Atlético SENA", equipoVisita: "Inter de Amigos", golesLocal: 4, golesVisita: 1, jugado: true },
    { id: 103, fecha: "Sábado 29 Ago", hora: "18:00", equipoLocal: "Real Chapinero", equipoVisita: "La Naranja Mecánica", golesLocal: null, golesVisita: null, jugado: false },
    { id: 104, fecha: "Sábado 29 Ago", hora: "19:30", equipoLocal: "Depor Bogotá", equipoVisita: "Atlético SENA", golesLocal: null, golesVisita: null, jugado: false },
    { id: 105, fecha: "Domingo 30 Ago", hora: "17:00", equipoLocal: "Los Galácticos F.C.", equipoVisita: "Real Chapinero", golesLocal: null, golesVisita: null, jugado: false },
  ]);

  // Formulario de inscripción
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [capitan, setCapitan] = useState(usuario?.nombre || "");
  const [telefonoCapitan, setTelefonoCapitan] = useState("");
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("Copa Nocturna F5");
  const [mensajeInscripcion, setMensajeInscripcion] = useState<string | null>(null);

  // Cargar estado persistente
  useEffect(() => {
    const savedTabla = localStorage.getItem("fz_tabla_torneos");
    if (savedTabla) {
      try { setTablaPosiciones(JSON.parse(savedTabla)); } catch {}
    }
    const savedFixture = localStorage.getItem("fz_fixture_torneos");
    if (savedFixture) {
      try { setFixture(JSON.parse(savedFixture)); } catch {}
    }
  }, []);

  const actualizarResultado = (partidoId: number, gLocal: number, gVisita: number) => {
    const nuevoFixture = fixture.map((p) =>
      p.id === partidoId ? { ...p, golesLocal: gLocal, golesVisita: gVisita, jugado: true } : p
    );
    setFixture(nuevoFixture);
    localStorage.setItem("fz_fixture_torneos", JSON.stringify(nuevoFixture));
    alert("¡Resultado actualizado en el fixture en vivo!");
  };

  const enviarInscripcion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreEquipo.trim()) {
      alert("Ingresa el nombre del equipo.");
      return;
    }
    setMensajeInscripcion(`¡Solicitud enviada para "${nombreEquipo}" en ${torneoSeleccionado}! La administración se contactará contigo para confirmar el pago.`);
    setNombreEquipo("");
    setTelefonoCapitan("");
    setTimeout(() => setMensajeInscripcion(null), 5000);
  };

  return (
    <div className="fz-torneos-container">
      <div className="fz-torneos-topbar">
        <div>
          <span className="fz-torneo-badge">🏆 COPA RELÁMPAGO FUTBOLZONE 2026</span>
          <h2>Campeonatos & Torneos Oficiales</h2>
          <p>Sigue la tabla de posiciones en tiempo real, consulta los próximos cruces o inscribe a tu equipo.</p>
        </div>

        <div className="fz-torneos-nav-pills">
          <button
            type="button"
            className={`fz-tnav-pill ${tabTorneo === "posiciones" ? "active" : ""}`}
            onClick={() => setTabTorneo("posiciones")}
          >
            📊 Tabla de Posiciones
          </button>
          <button
            type="button"
            className={`fz-tnav-pill ${tabTorneo === "fixture" ? "active" : ""}`}
            onClick={() => setTabTorneo("fixture")}
          >
            ⚽ Fixture & Marcadores
          </button>
          <button
            type="button"
            className={`fz-tnav-pill ${tabTorneo === "inscripcion" ? "active" : ""}`}
            onClick={() => setTabTorneo("inscripcion")}
          >
            ✍️ Inscribir Equipo
          </button>
        </div>
      </div>

      {/* ── SUBVISTA 1: TABLA DE POSICIONES ── */}
      {tabTorneo === "posiciones" && (
        <div className="fz-torneo-view-card">
          <div className="fz-table-responsive">
            <table className="fz-standings-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Pos</th>
                  <th>Equipo</th>
                  <th>PTS</th>
                  <th>PJ</th>
                  <th>PG</th>
                  <th>PE</th>
                  <th>PP</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                </tr>
              </thead>
              <tbody>
                {tablaPosiciones.map((eq, index) => (
                  <tr key={eq.id} className={index === 0 ? "leader" : index < 4 ? "playoff" : ""}>
                    <td>
                      <span className={`pos-number pos-${index + 1}`}>{index + 1}</span>
                    </td>
                    <td>
                      <strong>{eq.nombre}</strong>
                      {index === 0 && <span className="leader-crown"> 👑</span>}
                    </td>
                    <td><strong className="pts-highlight">{eq.puntos}</strong></td>
                    <td>{eq.pj}</td>
                    <td>{eq.pg}</td>
                    <td>{eq.pe}</td>
                    <td>{eq.pp}</td>
                    <td>{eq.gf}</td>
                    <td>{eq.gc}</td>
                    <td><span className={eq.dg >= 0 ? "dg-positive" : "dg-negative"}>{eq.dg > 0 ? `+${eq.dg}` : eq.dg}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fz-table-legend-notes">
            <span>🟢 Clasificación a Semifinales (Puestos 1 al 4)</span>
            <span>🔴 Zona de Eliminación</span>
          </div>
        </div>
      )}

      {/* ── SUBVISTA 2: FIXTURE & MARCADORES ── */}
      {tabTorneo === "fixture" && (
        <div className="fz-torneo-view-card">
          <div className="fz-fixture-list">
            {fixture.map((p) => (
              <div key={p.id} className="fz-match-fixture-card">
                <div className="fz-match-header-info">
                  <span>🗓️ {p.fecha} · ⏰ {p.hora}</span>
                  <span className={`fz-match-badge ${p.jugado ? "done" : "scheduled"}`}>
                    {p.jugado ? "FINALIZADO" : "PROGRAMADO"}
                  </span>
                </div>

                <div className="fz-match-teams-box">
                  <div className="fz-team-side local">
                    <strong>{p.equipoLocal}</strong>
                  </div>

                  <div className="fz-match-score-board">
                    {p.jugado ? (
                      <span className="score-text">{p.golesLocal} - {p.golesVisita}</span>
                    ) : (
                      <span className="vs-text">VS</span>
                    )}
                  </div>

                  <div className="fz-team-side visitor">
                    <strong>{p.equipoVisita}</strong>
                  </div>
                </div>

                {/* Controles de Administrador para cambiar marcador en vivo */}
                {esAdmin && (
                  <div className="fz-admin-score-editor">
                    <span>👑 Admin Marcador:</span>
                    <button
                      type="button"
                      className="fz-btn-score-quick"
                      onClick={() => {
                        const gl = prompt(`Goles de ${p.equipoLocal}:`, `${p.golesLocal ?? 0}`);
                        const gv = prompt(`Goles de ${p.equipoVisita}:`, `${p.golesVisita ?? 0}`);
                        if (gl !== null && gv !== null) {
                          actualizarResultado(p.id, Number(gl), Number(gv));
                        }
                      }}
                    >
                      ✏️ Editar Resultado
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUBVISTA 3: INSCRIBIR EQUIPO ── */}
      {tabTorneo === "inscripcion" && (
        <div className="fz-torneo-view-card" style={{ maxWidth: "650px", margin: "0 auto" }}>
          <h3>✍️ Formulario de Inscripción de Equipos</h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            Registra a tu equipo para disputar el premio de <strong>$1.500.000 COP</strong> en la Copa FutbolZone.
          </p>

          <form onSubmit={enviarInscripcion} className="fz-form-inline">
            <div className="fz-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="fz-field">
                <label>Nombre del Equipo *</label>
                <input
                  type="text"
                  placeholder="Ej: Los Vengadores FC"
                  value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)}
                  required
                />
              </div>

              <div className="fz-field">
                <label>Torneo de Interés *</label>
                <select value={torneoSeleccionado} onChange={(e) => setTorneoSeleccionado(e.target.value)}>
                  <option value="Copa Nocturna F5">Copa Nocturna F5 ($150.000)</option>
                  <option value="Torneo Empresarial F7">Torneo Empresarial F7 ($250.000)</option>
                  <option value="Liga Dominical F11">Liga Dominical F11 ($400.000)</option>
                </select>
              </div>
            </div>

            <div className="fz-form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "14px" }}>
              <div className="fz-field">
                <label>Capitán / Responsable *</label>
                <input
                  type="text"
                  value={capitan}
                  onChange={(e) => setCapitan(e.target.value)}
                  required
                />
              </div>

              <div className="fz-field">
                <label>Teléfono de Contacto (WhatsApp) *</label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  value={telefonoCapitan}
                  onChange={(e) => setTelefonoCapitan(e.target.value)}
                  required
                />
              </div>
            </div>

            {mensajeInscripcion && (
              <div className="fz-alert-exito" style={{ marginTop: "14px" }}>
                ✅ {mensajeInscripcion}
              </div>
            )}

            <button type="submit" className="fz-btn-primary" style={{ width: "100%", marginTop: "18px" }}>
              Enviar Solicitud de Inscripción
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TorneosView;
