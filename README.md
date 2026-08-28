# ⚽ FutbolZone — Guía Unificada de Ejecución (SENA ADSO III)

Sistema integral de gestión de canchas sintéticas, reservas en tiempo real y administración de torneos y empleados.  
Desarrollado para el **Proyecto Formativo SENA ADSO III Trimestre**.

---

## 📁 Estructura del Proyecto

```text
Proyecto_Nicolas_3407178/
├── backend/                        ← Backend API REST (FastAPI + SQLAlchemy + SQLite/MySQL)
├── frontend/                       ← Frontend Web (React 18 + Vite + TypeScript)
├── docs/                           ← Documentación técnica y Backlog en Excel
│   └── Backlog_FutbolZone_Navegable.xlsx
├── Backlog_FutbolZone_Navegable.xlsx ← Copia en la raíz para entrega directa
└── README.md                       ← Guía de ejecución unificada (este archivo)
```

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Python 3.10+** ([Descargar Python](https://www.python.org/downloads/))
- **Node.js 18+** y **npm** ([Descargar Node.js](https://nodejs.org/))
- (Opcional) **MySQL / XAMPP / WAMP** (Si no está activo, la aplicación usará automáticamente **SQLite** como base de datos de respaldo sin fallar).

---

## 🚀 Paso a Paso: Instalación y Ejecución

### 1. Iniciar el Backend (API REST en FastAPI)

Abre una terminal (PowerShell o CMD) en la raíz del proyecto `Proyecto_Nicolas_3407178` y ejecuta los siguientes comandos:

```bash
# 1. Entrar a la carpeta del backend
cd backend

# 2. Instalar las dependencias de Python
pip install -r requirements.txt

# 3. Iniciar el servidor backend de FastAPI (escucha en el puerto 5000)
python main.py
```

*Nota:* Alternativamente puedes usar `uvicorn main:app --reload --port 5000`.

La API estará lista y accesible en:
- **API URL Base:** `http://localhost:5000`
- **Documentación Interactiva Swagger UI:** `http://localhost:5000/docs`

> 💡 **Base de Datos Automática:** Al arrancar el backend por primera vez, se creará la base de datos y se sembrarán automáticamente los datos de prueba (Admin, Cliente, Canchas y Empleados).

---

### 2. Iniciar el Frontend (React + Vite + TypeScript)

Abre **otra ventana o pestaña de terminal** en la raíz del proyecto `Proyecto_Nicolas_3407178` y ejecuta:

```bash
# 1. Entrar a la carpeta del frontend
cd frontend

# 2. Instalar los paquetes de Node.js
npm install

# 3. Iniciar el servidor de desarrollo de Vite
npm run dev
```

El servidor web abrirá o mostrará la URL de acceso local, usualmente:
- **Frontend App:** `http://localhost:5173` (o `http://localhost:5174`)

---

## 🔑 Credenciales de Prueba (Demostración Rápida)

En el formulario de **Iniciar Sesión** del frontend encontrarás botones de acceso directo con 1-clic, o bien puedes ingresar manualmente:

| Rol | Correo Electrónico | Contraseña | Acceso y Permisos |
|-----|-------------------|------------|-------------------|
| 👑 **Administrador** | `admin@futbolzone.com` | `admin123` | Control total: Dashboard Admin, Gestión de Canchas, Reservas, Usuarios, Empleados y Reportes. |
| 🏃 **Cliente** | `cliente@futbolzone.com` | `cliente123` | Dashboard Cliente: Ver Mis Reservas, Reservar Canchas en tiempo real y Cancelar turnos. |

---

## ⚡ Características Principales

1. **Autenticación con JWT & Validación de Seguridad:** Tokens almacenados en `localStorage` con sesión persistente, validación de contraseñas de 8+ caracteres con símbolos y barra visual de fortaleza en tiempo real.
2. **Navegación Dedicada e Independiente:** Login, Registro y la personalización de Reserva cuentan con páginas completas independientes.
3. **Reserva Interactiva en Tiempo Real:** Personalización de número de jugadores (2-22), horas (1-3) y kit opcional de balón/petos con cálculo automático del total.
4. **Galería Acordeón e Ilustración de Canchas:** Sección interactiva visual para explorar césped sintético, iluminación LED nocturna y fotos por cada tipo de cancha.
5. **Resiliencia de Base de Datos:** Conexión a MySQL con fallback transparente a SQLite `sqlite:///./futbolzone.db`.
6. **Dashboards Admin y Cliente:** Gestión de canchas, reservas, usuarios, empleados y reportes de recaudación.

---

## 📋 Documentación de Requisitos (Backlog Excel)

El archivo oficial del backlog en Excel **Backlog_FutbolZone_Navegable.xlsx** ha sido incluido directamente dentro del repositorio del proyecto en:
- `docs/Backlog_FutbolZone_Navegable.xlsx`
- `Backlog_FutbolZone_Navegable.xlsx` (en la raíz del proyecto)

Incluye la matriz completa de las **38 Historias de Usuario (HU-01 a HU-38)** con índice navegable e hipervínculos funcionales, incluyendo autenticación JWT, reserva interactiva, tarifación dinámica por hora pico, anuncios globales en vivo, registro de medios de pago, agendado en Google Calendar, comprobante PDF con QR, filtro rápido de canchas, reportes CSV y widget WhatsApp.
