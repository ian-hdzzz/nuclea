Create SCHEMA nucleaflowit;
USE nucleaflowit;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    idUsuario BIGINT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contrasena VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    Fecha_inicio_colab DATE NOT NULL,
    Fecha_vencimiento_colab DATE,
    Ciudad VARCHAR(60),
    Pais VARCHAR(60),
    Calle VARCHAR(60),
    Modalidad VARCHAR(20),
    Estatus BOOLEAN DEFAULT TRUE
);

-- Tabla de Departamentos
CREATE TABLE Departamentos (
    idDepartamento INT PRIMARY KEY,
    Nombre_departamento VARCHAR(40) NOT NULL,
    Descripcion VARCHAR(200),
    Estado BOOLEAN DEFAULT TRUE
);

-- Tabla de Lider Departamento
CREATE TABLE Lider_departamento (
    idUsuario BIGINT,
    idDepartamento INT,
    Fecha_asignacion DATE NOT NULL,
    Fecha_finalizacion DATE,
    Estado BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (idUsuario, idDepartamento),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idDepartamento) REFERENCES Departamentos(idDepartamento)
);

-- Tabla de Pertenece
CREATE TABLE Pertenece (
    idUsuario BIGINT,
    idDepartamento INT,
    Fecha_asignacion DATE NOT NULL,
    Fecha_finalizacion DATE,
    Estado BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (idUsuario, idDepartamento),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idDepartamento) REFERENCES Departamentos(idDepartamento)
);

-- Tabla de Solicitudes
CREATE TABLE Solicitudes (
    idSolicitud BIGINT PRIMARY KEY,
    idUsuario BIGINT,
    idUsuarioL BIGINT,
    idUsuarioA BIGINT,
    Tipo VARCHAR(50) NOT NULL,
    Fecha_inicio DATE NOT NULL,
    Fecha_fin DATE NOT NULL,
    Descripcion VARCHAR(500),
    Aprobacion_L VARCHAR(15) DEFAULT 'Pendiente',
    Fecha_aprob_L DATE,
    Aprobacion_A VARCHAR(15) DEFAULT 'Pendiente',
    Fecha_aprob_A DATE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idUsuarioL) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idUsuarioA) REFERENCES Usuarios(idUsuario)
);

-- Tabla de Roles
CREATE TABLE Roles (
    idRol BIGINT PRIMARY KEY,
    Nombre_rol VARCHAR(30) NOT NULL
);

-- Tabla de Relación Usuario-Rol
CREATE TABLE User_Rol (
    idUsuario BIGINT,
    idRol BIGINT,
    Fecha_asignacion DATE NOT NULL,
    PRIMARY KEY (idUsuario, idRol),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idRol) REFERENCES Roles(idRol)
);

-- Tabla de Privilegios
CREATE TABLE Privilegios (
    idPrivilegio BIGINT PRIMARY KEY,
    Nombre_privilegio VARCHAR(100) NOT NULL
);

-- Tabla de Relación Rol-Privilegios
CREATE TABLE Rol_Privilegios (
    idRol BIGINT,
    idPrivilegio BIGINT,
    PRIMARY KEY (idRol, idPrivilegio),
    FOREIGN KEY (idRol) REFERENCES Roles(idRol),
    FOREIGN KEY (idPrivilegio) REFERENCES Privilegios(idPrivilegio)
);

-- Tabla de KPI’s
CREATE TABLE KPIs (
    idKpi BIGINT PRIMARY KEY,
    idUsuario BIGINT,
    idUsuario_LoA BIGINT,
    Nombre_KPI VARCHAR(100) NOT NULL,
    Estatus VARCHAR(30) DEFAULT 'En progreso',
    Progreso INT DEFAULT 0,
    Fecha_tentativa DATE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idUsuario_LoA) REFERENCES Usuarios(idUsuario)
);

-- Tabla de Tareas
CREATE TABLE Tareas (
    idTarea BIGINT PRIMARY KEY,
    idKPI BIGINT,
    Nombre_tarea VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(700),
    Estatus VARCHAR(15) DEFAULT 'Pendiente',
    Evidencia VARCHAR(1000) DEFAULT '',
    FOREIGN KEY (idKPI) REFERENCES KPIs(idKpi)
);

-- Tabla de Reunión 1:1
CREATE TABLE Reuniones (
    idReunion BIGINT PRIMARY KEY,
    idUsuario BIGINT,
    idUsuario_A BIGINT,
    Fecha_reunion DATE NOT NULL,
    De_que_orgulloso_mes_pasado VARCHAR(1000),  -- Respuesta a: ¿De qué estás orgulloso del mes pasado?
    Estas_preocupado_decepcionado_estresado VARCHAR(1000),  -- Respuesta a: ¿Estás preocupado, decepcionado o estresado?
    Que_trabajando VARCHAR(1000),  -- Respuesta a: ¿En qué te encuentras trabajando?
    Meta_mes VARCHAR(1000),  -- Respuesta a: ¿Cuál va a ser tu meta del mes?
    Carga_trabajo INT,            -- Respuesta a: Carga de trabajo (1 a 5)
    Salud_fisica INT,            -- Respuesta a: Salud física (1 a 5)
    Reconocimiento INT,            -- Respuesta a: Reconocimiento (1 a 5)
    Salud_emocional INT,            -- Respuesta a: Salud emocional (1 a 5)
    Equilibrio_trabajo_vida INT,            -- Respuesta a: Equilibrio entre trabajo y vida personal (1 a 5)
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idUsuario_A) REFERENCES Usuarios(idUsuario)
);

-- Tabla de Comentarios
CREATE TABLE Comentarios (
    idComentario BIGINT PRIMARY KEY,
    idReunion BIGINT,
    Comentario_general TEXT,
    Comentario_RRHH TEXT,
    FOREIGN KEY (idReunion) REFERENCES Reuniones(idReunion)
);

CREATE TABLE Faltas_administrativas (
    idFalta BIGINT PRIMARY KEY,
    idUsuario BIGINT,
    idUsuario_A BIGINT,
    Fecha_asignacion_falta DATE NOT NULL,
    Motivo TEXT,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
    FOREIGN KEY (idUsuario_A) REFERENCES Usuarios(idUsuario)
);

CREATE TABLE DiasFeriados (
    idDiaFeriado BIGINT PRIMARY KEY,
    idUsuario_A BIGINT,
    Nombre_asueto VARCHAR(400), 
    Fecha_asueto DATE,
    FOREIGN KEY (idUsuario_A) REFERENCES Usuarios(idUsuario)
);
ALTER TABLE Reuniones
DROP COLUMN De_que_orgulloso_mes_pasado,
DROP COLUMN Estas_preocupado_decepcionado_estresado,
DROP COLUMN Que_trabajando,
DROP COLUMN Meta_mes,
DROP COLUMN Carga_trabajo,
DROP COLUMN Salud_fisica,
DROP COLUMN Reconocimiento,
DROP COLUMN Salud_emocional,
DROP COLUMN Equilibrio_trabajo_vida;

-- Tabla de respuestas abiertas
CREATE TABLE Respuestas_Abiertas (
    idRespuestaAbierta BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
    idReuniones BIGINT(20),
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NULL,
    FOREIGN KEY (idReunion) REFERENCES Reuniones(idReunion) ON DELETE CASCADE
);

ALTER TABLE preguntas_abiertas
ADD COLUMN descripcion TEXT AFTER pregunta;

-- Tabla de respuestas cerradas
CREATE TABLE Respuestas_Cerradas (
    idRespuestaCerrada BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
    idReuniones BIGINT(20),
    pregunta VARCHAR(255) NOT NULL,
    respuesta INT(11) NOT NULL CHECK (respuesta BETWEEN 1 AND 5),
    FOREIGN KEY (idReunion) REFERENCES Reuniones(idReunion) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER insertar_preguntas_default AFTER INSERT ON Reuniones
FOR EACH ROW
BEGIN
    -- Inserta las 4 preguntas predefinidas para cada nueva reunión
    INSERT INTO preguntas_abiertas (idReunion, pregunta, descripcion) VALUES 
    (NEW.idReunion, 'What are you proud of from the past month?', 'Identify personal or team achievements and progress.'),
    (NEW.idReunion, 'Are you worried, disappointed, or stressed?', 'Evaluate factors that may be affecting employee satisfaction.'),
    (NEW.idReunion, 'What are you currently working on?', 'Understand the current activities of each team member.'),
    (NEW.idReunion, 'What will your goal be for the month?', 'Define short-term objectives and align them with the team vision.');
END //

DELIMITER ;