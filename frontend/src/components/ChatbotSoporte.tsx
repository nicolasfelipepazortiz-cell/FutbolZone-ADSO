import { useState, useRef, useEffect } from "react";
import "./ChatbotSoporte.css";

interface MensajeChat {
  id: string;
  remitente: "bot" | "usuario";
  texto: string;
  hora: string;
  opciones?: string[];
}

const PREGUNTAS_FRECUENTES: { [key: string]: string } = {
  "precios": "⚽ **Tarifas Oficiales por Hora:**\n- Fútbol 5 (10 jugadores): **$50.000 COP**\n- Fútbol 7 (14 jugadores): **$70.000 COP**\n- Fútbol 11 (22 jugadores): **$100.000 COP**\n\nTodos los turnos incluyen iluminación LED de estadio y petos limpios.",
  "horarios": "⏰ **Horario de Atención:**\nLunes a Domingo de **6:00 AM a 11:00 PM**.\nPuedes reservar turnos diurnos o nocturnos en tiempo real desde la plataforma.",
  "reservar": "⚡ **Cómo Reservar en 3 Pasos:**\n1. Elige tu cancha (Fútbol 5, 7 u 11).\n2. Selecciona fecha, hora y duración.\n3. Elige tu método de pago (Nequi, Daviplata, Tarjeta o Efectivo en taquilla) ¡y descarga tu ticket con código QR!",
  "torneos": "🏆 **Campeonatos y Copas 2026:**\nTenemos la *Copa Relámpago Nocturna F5* ($150.000 de inscripción con premio mayor de **$1.500.000 COP**). Puedes ver la tabla de posiciones en vivo y el fixture desde la pestaña 'Torneos'.",
  "cancelar": "🔄 **Cancelaciones y Reembolsos:**\nPuedes cancelar tu turno hasta **2 horas antes** de la hora agendada desde tu panel en 'Mis Reservas' sin ningún recargo.",
  "ubicacion": "📍 **Ubicación de la Sede:**\nAv. Calle 63 # 28-50, Complejo Deportivo FutbolZone D.C.\nContamos con parqueadero vigilado para autos y motos, vestuarios con agua caliente y cafetería.",
  "cupones": "🎟️ **Cupones de Descuento Activos:**\n- `FUTBOL2026` ➔ 20% de descuento\n- `SENA20` ➔ 15% de descuento formativo\n- `NOCHE10` ➔ 10% en reservas nocturnas\n¡Ingrésalos en la pantalla de reserva para ahorrar en tu partido!",
  "contacto": "📞 **Atención Directa:**\nPuedes chatear con nuestro equipo por WhatsApp al **+57 300 123 4567** o escribirnos a **contacto@futbolzone.com**.",
};

function ChatbotSoporte() {
  const [abierto, setAbierto] = useState<boolean>(false);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: "m_init",
      remitente: "bot",
      texto: "¡Hola crack! ⚽ Soy **FutbolBot**, tu asistente virtual de FutbolZone. ¿En qué te puedo colaborar hoy?",
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      opciones: ["Precios de canchas", "Cómo reservar", "Torneos y Premios", "Cupones de descuento", "¿Dónde están ubicados?"],
    },
  ]);
  const [inputTexto, setInputTexto] = useState<string>("");
  const [escribiendo, setEscribiendo] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, abierto, escribiendo]);

  const responderMensaje = (pregunta: string) => {
    const pLimpia = pregunta.toLowerCase();
    let respuesta = "Disculpa, no entendí bien tu consulta. Puedes preguntarme sobre **precios**, **cómo reservar**, **torneos**, **cupones**, **cancelaciones** o escribirnos a WhatsApp.";

    if (pLimpia.includes("precio") || pLimpia.includes("cuesta") || pLimpia.includes("valor") || pLimpia.includes("tarifa")) {
      respuesta = PREGUNTAS_FRECUENTES["precios"];
    } else if (pLimpia.includes("hora") || pLimpia.includes("abren") || pLimpia.includes("cierran")) {
      respuesta = PREGUNTAS_FRECUENTES["horarios"];
    } else if (pLimpia.includes("reserva") || pLimpia.includes("agendar") || pLimpia.includes("cómo")) {
      respuesta = PREGUNTAS_FRECUENTES["reservar"];
    } else if (pLimpia.includes("torneo") || pLimpia.includes("copa") || pLimpia.includes("premio") || pLimpia.includes("fixture") || pLimpia.includes("posicion")) {
      respuesta = PREGUNTAS_FRECUENTES["torneos"];
    } else if (pLimpia.includes("cancel") || pLimpia.includes("reembols") || pLimpia.includes("cambiar")) {
      respuesta = PREGUNTAS_FRECUENTES["cancelar"];
    } else if (pLimpia.includes("donde") || pLimpia.includes("ubicacion") || pLimpia.includes("direccion") || pLimpia.includes("llegar") || pLimpia.includes("mapa")) {
      respuesta = PREGUNTAS_FRECUENTES["ubicacion"];
    } else if (pLimpia.includes("cupon") || pLimpia.includes("descuento") || pLimpia.includes("promo") || pLimpia.includes("codigo")) {
      respuesta = PREGUNTAS_FRECUENTES["cupones"];
    } else if (pLimpia.includes("contacto") || pLimpia.includes("telefono") || pLimpia.includes("whatsapp") || pLimpia.includes("soporte") || pLimpia.includes("humano")) {
      respuesta = PREGUNTAS_FRECUENTES["contacto"];
    } else if (pLimpia.includes("hola") || pLimpia.includes("buenas") || pLimpia.includes("buenos")) {
      respuesta = "¡Hola goleador! ⚽ ¿Listo para armar el picadito? Pregúntame lo que necesites sobre turnos, canchas o torneos.";
    }

    setEscribiendo(true);
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          remitente: "bot",
          texto: respuesta,
          hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setEscribiendo(false);
    }, 600);
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    const textoUsuario = inputTexto.trim();
    setInputTexto("");

    setMensajes((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        remitente: "usuario",
        texto: textoUsuario,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    responderMensaje(textoUsuario);
  };

  const handleOpcionRapida = (opcion: string) => {
    setMensajes((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        remitente: "usuario",
        texto: opcion,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    responderMensaje(opcion);
  };

  return (
    <div className="fz-bot-container">
      {/* Botón flotante para abrir/cerrar */}
      {!abierto ? (
        <button
          type="button"
          className="fz-bot-floating-btn"
          onClick={() => setAbierto(true)}
          title="Asistente Virtual FutbolBot"
        >
          <div className="fz-bot-floating-pulse"></div>
          <span className="fz-bot-icon">🤖</span>
          <span className="fz-bot-badge">¿Dudas?</span>
        </button>
      ) : (
        <div className="fz-bot-window">
          {/* Header */}
          <div className="fz-bot-header">
            <div className="fz-bot-header-left">
              <div className="fz-bot-avatar">🤖</div>
              <div>
                <h4>FutbolBot AI</h4>
                <span className="fz-bot-online">● En línea 24/7</span>
              </div>
            </div>
            <button
              type="button"
              className="fz-bot-close-btn"
              onClick={() => setAbierto(false)}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="fz-bot-messages" ref={scrollRef}>
            {mensajes.map((m) => (
              <div key={m.id} className={`fz-bot-msg-wrap ${m.remitente}`}>
                <div className={`fz-bot-bubble ${m.remitente}`}>
                  <p style={{ whiteSpace: "pre-line", margin: 0 }}>{m.texto}</p>
                  <span className="fz-bot-msg-time">{m.hora}</span>
                </div>

                {m.opciones && m.opciones.length > 0 && (
                  <div className="fz-bot-quick-replies">
                    {m.opciones.map((op, i) => (
                      <button
                        key={i}
                        type="button"
                        className="fz-quick-reply-chip"
                        onClick={() => handleOpcionRapida(op)}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {escribiendo && (
              <div className="fz-bot-msg-wrap bot">
                <div className="fz-bot-bubble bot typing">
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleEnviar} className="fz-bot-input-form">
            <input
              type="text"
              placeholder="Escribe tu duda aquí..."
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              autoFocus
            />
            <button type="submit" className="fz-bot-send-btn" disabled={!inputTexto.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatbotSoporte;
