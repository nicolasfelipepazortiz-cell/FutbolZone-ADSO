import "./TicketReservaModal.css";

interface TicketReservaModalProps {
  reserva: any;
  usuario: any;
  onClose: () => void;
}

function TicketReservaModal({ reserva, usuario, onClose }: TicketReservaModalProps) {
  const imprimirTicket = () => {
    window.print();
  };

  const generarEnlaceCalendar = () => {
    const titulo = encodeURIComponent(`⚽ Partido en FutbolZone - ${reserva?.cancha_nombre || "Cancha Sintética"}`);
    const fechaLimpia = (reserva?.fecha || new Date().toISOString().split("T")[0]).replace(/-/g, "");
    const hInicio = (reserva?.hora_inicio || "18:00").substring(0, 5).replace(":", "") + "00";
    const hFin = (reserva?.hora_fin || "19:00").substring(0, 5).replace(":", "") + "00";
    
    const datesParam = `${fechaLimpia}T${hInicio}/${fechaLimpia}T${hFin}`;
    const detalles = encodeURIComponent(`Reserva #${reserva?.id || "001"} en FutbolZone. Presentar ticket en recepción 15 min antes.`);
    const ubicacion = encodeURIComponent("Av. Calle 63 # 28-50, FutbolZone D.C.");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${datesParam}&details=${detalles}&location=${ubicacion}`;
  };

  return (
    <div className="ticket-modal-overlay">
      <div className="ticket-modal-card">
        <button type="button" className="btn-close-ticket" onClick={onClose}>
          ✕
        </button>

        {/* CONTENIDO IMPRIMIBLE DEL TICKET */}
        <div className="ticket-printable-content">
          <div className="ticket-header">
            <h2>⚽ FutbolZone</h2>
            <span className="ticket-badge-official">COMPROBANTE OFICIAL DE RESERVA</span>
            <p className="ticket-sub">Complejo Deportivo & Canchas Sintéticas</p>
          </div>

          <div className="ticket-qr-section">
            <div className="qr-box-simulated">
              <span>📱 QR</span>
              <small>#RES-{reserva?.id || "001"}</small>
            </div>
            <div className="ticket-code-info">
              <strong>Código de Reserva:</strong>
              <div className="code-hash">FZ-2026-{reserva?.id || "99"}-OK</div>
            </div>
          </div>

          <div className="ticket-details-grid">
            <div className="ticket-row">
              <span>Cliente / Titular:</span>
              <strong>{usuario?.nombre} {usuario?.apellido}</strong>
            </div>

            <div className="ticket-row">
              <span>Correo de Contacto:</span>
              <strong>{usuario?.email || usuario?.correo || "cliente@futbolzone.com"}</strong>
            </div>

            <div className="ticket-row">
              <span>Cancha Asignada:</span>
              <strong>{reserva?.cancha_nombre || `Cancha #${reserva?.cancha_id || 1}`}</strong>
            </div>

            <div className="ticket-row">
              <span>Fecha del Partido:</span>
              <strong>{reserva?.fecha}</strong>
            </div>

            <div className="ticket-row">
              <span>Horario Reservado:</span>
              <strong>{reserva?.hora_inicio?.substring(0, 5)} - {reserva?.hora_fin?.substring(0, 5)}</strong>
            </div>

            <div className="ticket-row">
              <span>Detalles Adicionales:</span>
              <strong>{reserva?.notas || "Fútbol Sintético con Iluminación LED"}</strong>
            </div>

            <div className="ticket-row total-row">
              <span>Total Pagado / A Pagar:</span>
              <strong className="total-price">${Number(reserva?.precio_total || 50000).toLocaleString("es-CO")} COP</strong>
            </div>
          </div>

          <div className="ticket-footer-notes">
            <p>📌 Presenta este ticket en recepción 15 minutos antes de iniciar tu partido.</p>
            <p>© 2026 FutbolZone — Todos los derechos reservados.</p>
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div className="ticket-modal-actions" style={{ flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn-imprimir-ticket" onClick={imprimirTicket}>
              🖨️ Imprimir / Guardar PDF
            </button>
            <a
              href={generarEnlaceCalendar()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-calendar-link"
            >
              📅 Google Calendar
            </a>
          </div>

          <button type="button" className="btn-cerrar-ticket-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketReservaModal;
