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

## 🚀 Cómo Ejecutar el Proyecto

### 🌟 Opción 1: Inicio Automático con 1 Solo Clic (Recomendada)
En la carpeta principal del proyecto, simplemente haz doble clic en el archivo:
👉 **`iniciar_proyecto.bat`**

Este archivo abrirá automáticamente:
1. La ventana del **Backend en FastAPI** (puerto 5000).
2. La ventana del **Frontend en Vite React** (puerto 5173).
3. Tu navegador web en **`http://localhost:5173`**.

*(Para apagar todo cuando termines, solo haz doble clic en **`detener_proyecto.bat`**).*

---

### 💻 Opción 2: Inicio Manual en Dos Terminales

Dado que es un proyecto **Fullstack** (Backend en Python y Frontend en React), debes tener **DOS terminales abiertas al mismo tiempo**:

#### 📌 Terminal 1 — Backend (FastAPI):
```bash
# 1. Entrar a la carpeta backend
cd backend

# 2. Iniciar el servidor
python main.py
```
> El backend quedará corriendo en: `http://localhost:5000` (Docs: `http://localhost:5000/docs`).

#### 📌 Terminal 2 — Frontend (React Vite):
*Abre una **NUEVA** pestaña o ventana de terminal (no uses la misma del backend)*:
```bash
# 1. Entrar a la carpeta frontend
cd frontend

# 2. Iniciar el servidor web
npm run dev
```
> El frontend quedará disponible en: `http://localhost:5173`.

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
