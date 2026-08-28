import "./WhatsappFloat.css";

function WhatsappFloat() {
  const numeroTelefono = "573001234567";
  const mensaje = encodeURIComponent("¡Hola FutbolZone! Quisiera más información sobre la reserva de canchas sintéticas.");
  const urlWhatsapp = `https://wa.me/${numeroTelefono}?text=${mensaje}`;

  return (
    <a
      href={urlWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="Soporte y Atención por WhatsApp"
    >
      <span className="whatsapp-icon">💬</span>
      <span className="whatsapp-text">Soporte WhatsApp</span>
    </a>
  );
}

export default WhatsappFloat;
