CREATE SCHEMA nucleaflowit;
USE nucleaflowit;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    fecha_inicio_colab DATE NOT NULL,
    fecha_vencimiento_colab DATE,
    ciudad VARCHAR(60),
    pais VARCHAR(60),
    calle VARCHAR(60),
    modalidad VARCHAR(20),
    estatus BOOLEAN DEFAULT TRUE,
    dias_vacaciones INT
);

-- Tabla de Departamentos
CREATE TABLE departamentos (
    id_departamento INT PRIMARY KEY,
    nombre_departamento VARCHAR(40) NOT NULL,
    descripcion VARCHAR(200),
    estado BOOLEAN DEFAULT TRUE
);

-- Tabla de Lider Departamento
CREATE TABLE lider_departamento (
    id_usuario BIGINT,
    id_departamento INT,
    fecha_asignacion DATE NOT NULL,
    fecha_finalizacion DATE,
    estado BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_usuario, id_departamento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

-- Tabla de Pertenece
CREATE TABLE pertenece (
    id_usuario BIGINT,
    id_departamento INT,
    fecha_asignacion DATE NOT NULL,
    fecha_finalizacion DATE,
    estado BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_usuario, id_departamento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

-- Tabla de Solicitudes
CREATE TABLE solicitudes (
    id_solicitud BIGINT PRIMARY KEY,
    id_usuario BIGINT,
    tipo VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion VARCHAR(500),
    aprobacion_l VARCHAR(15) DEFAULT 'Pendiente',
    fecha_aprob_l DATE,
    aprobacion_a VARCHAR(15) DEFAULT 'Pendiente',
    fecha_aprob_a DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE dias_solicitados (
    id_solicitud BIGINT PRIMARY KEY,
    dias INT,
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

-- Tabla de Roles
CREATE TABLE roles (
    id_rol BIGINT PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL
);

-- Tabla de Relación Usuario-Rol
CREATE TABLE user_rol (
    id_usuario BIGINT,
    id_rol BIGINT,
    fecha_asignacion DATE NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla de Privilegios
CREATE TABLE privilegios (
    id_privilegio BIGINT PRIMARY KEY,
    nombre_privilegio VARCHAR(100) NOT NULL
);

-- Tabla de Relación Rol-Privilegios
CREATE TABLE rol_privilegios (
    id_rol BIGINT,
    id_privilegio BIGINT,
    PRIMARY KEY (id_rol, id_privilegio),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (id_privilegio) REFERENCES privilegios(id_privilegio)
);

-- Tabla de Reunión 1:1
CREATE TABLE reuniones (
    id_reunion BIGINT PRIMARY KEY,
    id_usuario BIGINT,
    fecha_reunion DATE NOT NULL,
    de_que_orgulloso_mes_pasado VARCHAR(1000),
    estas_preocupado_decepcionado_estresado VARCHAR(1000),
    que_trabajando VARCHAR(1000),
    meta_mes VARCHAR(1000),
    carga_trabajo INT,
    salud_fisica INT,
    reconocimiento INT,
    salud_emocional INT,
    equilibrio_trabajo_vida INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de Comentarios
CREATE TABLE comentarios (
    id_comentario BIGINT PRIMARY KEY,
    id_reunion BIGINT,
    comentario_general TEXT,
    comentario_rrhh TEXT,
    FOREIGN KEY (id_reunion) REFERENCES reuniones(id_reunion)
);

CREATE TABLE faltas_administrativas (
    id_falta BIGINT PRIMARY KEY,
    id_usuario BIGINT,
    fecha_asignacion_falta DATE NOT NULL,
    motivo TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE dias_feriados (
    id_dia_feriado BIGINT PRIMARY KEY,
    id_usuario_a BIGINT,
    nombre_asueto VARCHAR(400), 
    fecha_asueto DATE,
    FOREIGN KEY (id_usuario_a) REFERENCES usuarios(id_usuario)
);