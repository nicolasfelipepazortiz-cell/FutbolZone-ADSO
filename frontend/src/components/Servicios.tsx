import { useState } from "react";
import "./Servicios.css";

function Servicios() {
  const [servicioSeleccionado, setServicioSeleccionado] =
    useState<string>("");

  const servicios = [
    {
      nombre: "⚽ Cancha Fútbol 5",
      descripcion:
        "Ideal para partidos rápidos y divertidos entre amigos.",
    },
    {
      nombre: "⚽ Cancha Fútbol 7",
      descripcion:
        "Para un juego más táctico y dinámico con más jugadores.",
    },
    {
      nombre: "⚽ Cancha Fútbol 11",
      descripcion:
        "La experiencia completa del fútbol profesional.",
    },
  ];

  return (
    <section id="servicios" className="servicios-section">
      <h2>⚽ Nuestros Servicios</h2>

      <p className="servicios-descripcion">
        Elige el servicio que más se adapte a tu equipo.
      </p>

      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div className="servicio-card" key={servicio.nombre}>
            <h3>{servicio.nombre}</h3>

            <p>{servicio.descripcion}</p>

            <button
              onClick={() =>
                setServicioSeleccionado(servicio.nombre)
              }
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>

      {servicioSeleccionado && (
        <div className="servicio-seleccionado">
          <strong>Servicio seleccionado:</strong>
          <p>{servicioSeleccionado}</p>
        </div>
      )}
    </section>
  );
}

export default Servicios;