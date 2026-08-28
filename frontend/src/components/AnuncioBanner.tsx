import { useState } from "react";
import "./AnuncioBanner.css";

interface AnuncioBannerProps {
  anuncio?: {
    titulo: string;
    mensaje: string;
    activo: boolean;
  } | null;
}

function AnuncioBanner({ anuncio }: AnuncioBannerProps) {
  const [visible, setVisible] = useState<boolean>(true);

  if (!anuncio || !anuncio.activo || !visible) return null;

  return (
    <div className="fz-promo-banner">
      <div className="fz-promo-container">
        <div className="fz-promo-content">
          <span className="fz-promo-pill">⚡ PROMO EN VIVO</span>
          <span className="fz-promo-title">{anuncio.titulo}</span>
          <span className="fz-promo-divider">|</span>
          <span className="fz-promo-msg">{anuncio.mensaje}</span>
        </div>
        <button
          type="button"
          className="fz-promo-close-btn"
          onClick={() => setVisible(false)}
          title="Cerrar aviso promocional"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default AnuncioBanner;
