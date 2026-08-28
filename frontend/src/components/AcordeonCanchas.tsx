import { useState, useRef } from "react";
import "./AcordeonCanchas.css";

interface ShowcaseProps {
  onGoToCanchas?: () => void;
}

function AcordeonCanchas({ onGoToCanchas }: ShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const abrirWhatsApp = () => {
    const msg = encodeURIComponent("¡Hola FutbolZone! 👋 Me gustaría consultar la disponibilidad de canchas para armar un partido hoy.");
    window.open(`https://wa.me/573001234567?text=${msg}`, "_blank");
  };

  return (
    <section className="fz-showcase-section">
      <div
        ref={containerRef}
        className="fz-showcase-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fondo con Marca de Agua y Halos de Luz Dinámicos */}
        <div
          className="fz-showcase-bg-layer"
          style={{
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px) scale(1.05)`,
          }}
        >
          <div className="fz-watermark-text">FUTBOLZONE</div>
          <div className="fz-glow-spot light-1"></div>
          <div className="fz-glow-spot light-2"></div>
        </div>

        {/* Partículas / Luces Flotantes */}
        <div className="fz-particles-overlay">
          <span className="fz-particle p1"></span>
          <span className="fz-particle p2"></span>
          <span className="fz-particle p3"></span>
          <span className="fz-particle p4"></span>
          <span className="fz-particle p5"></span>
        </div>

        {/* Contenido Principal */}
        <div
          className="fz-showcase-content"
          style={{
            transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
          }}
        >
          {/* Top Pill / Badge */}
          <div className="fz-showcase-top-badge">
            <a href="#ubicacion" className="fz-btn-location-pill">
              📍 Ver todas las sedes y cómo llegar <span>↗</span>
            </a>
          </div>

          {/* Subtítulo con línea */}
          <div className="fz-showcase-subtitle">
            <span className="fz-dash">—</span> AGENDA TU TURNO EN VIVO
          </div>

          {/* Gran Título Impactante */}
          <h2 className="fz-showcase-headline">
            ¿Listo para reservar en la <br />
            <span className="fz-highlight-text">mejor app deportiva?</span>
          </h2>

          <p className="fz-showcase-desc">
            Césped sintético anti-impacto, iluminación LED de estadio, vestuarios con agua caliente y reservas en tiempo real.
          </p>

          {/* Botones de Acción Duales (Como la referencia) */}
          <div className="fz-showcase-cta-group">
            <a
              href="#canchas"
              className="fz-btn-cta-white"
              onClick={(e) => {
                if (onGoToCanchas) {
                  e.preventDefault();
                  onGoToCanchas();
                }
              }}
            >
              ⚽ Reservar Cancha Ahora <span>↗</span>
            </a>

            <button
              type="button"
              className="fz-btn-cta-whatsapp"
              onClick={abrirWhatsApp}
            >
              <span className="fz-wa-icon">💬</span>
              <span>WhatsApp · respuesta inmediata</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AcordeonCanchas;
