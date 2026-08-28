import "./UbicacionMapa.css";

function UbicacionMapa() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.815217482811!2d-74.072092!3d4.653332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzknMTIuMCJOIDc0wrAwNCcxOS41Ilc!5e0!3m2!1ses!2sco!4v1650000000000!5m2!1ses!2sco";

  return (
    <section id="ubicacion" className="ubicacion-section">
      <div className="ubicacion-container">
        <span className="section-badge">📍 Encuéntranos Fácilmente</span>
        <h2>Ubicación & Contacto</h2>
        <p className="ubicacion-sub">Visítanos en nuestras instalaciones principales o contáctanos para eventos privados</p>

        <div className="ubicacion-grid">
          <div className="ubicacion-info-card">
            <h3>⚽ Complejo Deportivo FutbolZone</h3>

            <div className="info-item">
              <span className="info-icon">🏢</span>
              <div>
                <strong>Dirección Principal:</strong>
                <p>Av. Calle 63 # 28-50, Bogotá D.C., Colombia</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <strong>Horario de Atención:</strong>
                <p>Lunes a Domingo: 6:00 AM – 11:00 PM</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono / Línea Directa:</strong>
                <p>(601) 555-FUTBOL | +57 300 123 4567</p>
              </div>
            </div>

            <div className="ubicacion-buttons">
              <a
                href="https://maps.google.com/?q=Av.+Calle+63+#+28-50,+Bogotá"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-map-app"
              >
                🗺️ Abrir en Google Maps
              </a>
              <a
                href="https://waze.com/ul?q=Av.+Calle+63+#+28-50,+Bogotá"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-waze-app"
              >
                🚗 Abrir en Waze
              </a>
            </div>
          </div>

          <div className="ubicacion-map-frame">
            <iframe
              title="Mapa de Ubicación FutbolZone"
              src={mapUrl}
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "16px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UbicacionMapa;
