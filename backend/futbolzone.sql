-- ================================================
-- FutbolZone — Script Base de Datos MySQL
-- Ejecutar en phpMyAdmin, HeidiSQL o MySQL Workbench
-- ================================================

CREATE DATABASE IF NOT EXISTS futbolzone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE futbolzone;

-- ── Tabla usuarios ──────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  apellido       VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  telefono       VARCHAR(20),
  password_hash  VARCHAR(255) NOT NULL,
  rol            ENUM('admin','cliente') DEFAULT 'cliente',
  activo         BOOLEAN DEFAULT TRUE,
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- ── Tabla canchas ───────────────────────────────
CREATE TABLE IF NOT EXISTS canchas (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  tipo                ENUM('Fútbol 5','Fútbol 7','Fútbol 11') DEFAULT 'Fútbol 5',
  descripcion         TEXT,
  capacidad_jugadores INT DEFAULT 10,
  precio_hora         DECIMAL(10,2) NOT NULL,
  tiene_iluminacion   BOOLEAN DEFAULT FALSE,
  tiene_techo         BOOLEAN DEFAULT FALSE,
  activa              BOOLEAN DEFAULT TRUE,
  creado_en           DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla horarios ──────────────────────────────
CREATE TABLE IF NOT EXISTS horarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id   INT NOT NULL,
  dia         ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin    TIME NOT NULL,
  disponible  BOOLEAN DEFAULT TRUE,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id)
);

-- ── Tabla reservas ──────────────────────────────
CREATE TABLE IF NOT EXISTS reservas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  cancha_id      INT NOT NULL,
  fecha          DATE NOT NULL,
  hora_inicio    TIME NOT NULL,
  hora_fin       TIME NOT NULL,
  precio_total   DECIMAL(10,2) NOT NULL,
  estado         ENUM('pendiente','confirmada','cancelada','completada') DEFAULT 'pendiente',
  notas          TEXT,
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (cancha_id)  REFERENCES canchas(id)
);

-- ── Tabla torneos ───────────────────────────────
CREATE TABLE IF NOT EXISTS torneos (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  nombre             VARCHAR(150) NOT NULL,
  descripcion        TEXT,
  cancha_id          INT NOT NULL,
  categoria          VARCHAR(50),
  fecha_inicio       DATE NOT NULL,
  fecha_fin          DATE NOT NULL,
  max_equipos        INT NOT NULL,
  precio_inscripcion DECIMAL(10,2) NOT NULL,
  premio             TEXT,
  estado             ENUM('abierto','en_curso','finalizado','cancelado') DEFAULT 'abierto',
  creado_en          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id)
);

-- ── Tabla inscripciones_torneo ──────────────────
CREATE TABLE IF NOT EXISTS inscripciones_torneo (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  torneo_id     INT NOT NULL,
  usuario_id    INT NOT NULL,
  nombre_equipo VARCHAR(100) NOT NULL,
  creado_en     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (torneo_id)  REFERENCES torneos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ── Tabla pagos ─────────────────────────────────
CREATE TABLE IF NOT EXISTS pagos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  reserva_id     INT,
  inscripcion_id INT,
  monto          DECIMAL(10,2) NOT NULL,
  metodo         ENUM('efectivo','transferencia','tarjeta','nequi','daviplata') NOT NULL,
  estado         ENUM('pendiente','pagado','fallido','reembolsado') DEFAULT 'pendiente',
  referencia     VARCHAR(100),
  notas          TEXT,
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)     REFERENCES usuarios(id),
  FOREIGN KEY (reserva_id)     REFERENCES reservas(id),
  FOREIGN KEY (inscripcion_id) REFERENCES inscripciones_torneo(id)
);

-- ── Tabla empleados ─────────────────────────────
CREATE TABLE IF NOT EXISTS empleados (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  apellido  VARCHAR(100) NOT NULL,
  cargo     ENUM('Administrador','Coordinador','Mantenimiento','Atención al cliente','Seguridad') NOT NULL,
  telefono  VARCHAR(20),
  email     VARCHAR(150) NOT NULL UNIQUE,
  activo    BOOLEAN DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- DATOS DE PRUEBA
-- ================================================

-- Admin (password: admin123)
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
('Admin', 'FutbolZone', 'admin@futbolzone.com',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhsVV68KyoSd3aMwkBdCGi', 'admin');

-- Cliente demo (password: cliente123)
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
('Carlos', 'Díaz', 'cliente@futbolzone.com',
 '$2b$12$92IXUNpkjO8QDlk/tQMrIuRIqhsa.6/2WrXmhL3JsQ0rTTkC.X7Hi', 'cliente');

-- Canchas
INSERT INTO canchas (nombre, tipo, descripcion, capacidad_jugadores, precio_hora, tiene_iluminacion, tiene_techo) VALUES
('Cancha Central',  'Fútbol 5',  'Cancha principal con pasto sintético de alta calidad', 10, 50000, TRUE,  FALSE),
('Cancha Norte',    'Fútbol 7',  'Cancha norte con iluminación LED',                      14, 70000, TRUE,  FALSE),
('Cancha Sur',      'Fútbol 11', 'Cancha reglamentaria para partidos completos',           22, 100000, TRUE, FALSE),
('Cancha Este',     'Fútbol 5',  'Cancha compacta ideal para entrenamiento',               10, 45000, FALSE, TRUE),
('Cancha Oeste',    'Fútbol 7',  'Cancha con techo para días lluviosos',                   14, 65000, TRUE,  TRUE);

-- Horarios de ejemplo
INSERT INTO horarios (cancha_id, dia, hora_inicio, hora_fin) VALUES
(1, 'Lunes',    '06:00:00', '22:00:00'),
(1, 'Martes',   '06:00:00', '22:00:00'),
(1, 'Miércoles','06:00:00', '22:00:00'),
(1, 'Jueves',   '06:00:00', '22:00:00'),
(1, 'Viernes',  '06:00:00', '22:00:00'),
(1, 'Sábado',   '07:00:00', '20:00:00'),
(1, 'Domingo',  '08:00:00', '18:00:00'),
(2, 'Lunes',    '06:00:00', '22:00:00'),
(2, 'Sábado',   '07:00:00', '20:00:00');

-- Empleados
INSERT INTO empleados (nombre, apellido, cargo, telefono, email) VALUES
('Juan',   'Pérez',   'Administrador',       '3001234567', 'juan.perez@futbolzone.com'),
('María',  'González','Coordinador',         '3109876543', 'maria.gonzalez@futbolzone.com'),
('Pedro',  'Ramírez', 'Mantenimiento',       '3205556677', 'pedro.ramirez@futbolzone.com'),
('Sofía',  'Torres',  'Atención al cliente', '3154443322', 'sofia.torres@futbolzone.com'),
('Carlos', 'Vargas',  'Seguridad',           '3001112233', 'carlos.vargas@futbolzone.com');
