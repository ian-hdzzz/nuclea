-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-flowitbd.alwaysdata.net
-- Generation Time: Apr 30, 2025 at 06:59 PM
-- Server version: 10.11.11-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flowitbd_basededatos`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comentarios`
--

CREATE TABLE `Comentarios` (
  `idComentario` bigint(20) NOT NULL,
  `idReunion` bigint(20) DEFAULT NULL,
  `Comentario_general` text DEFAULT NULL,
  `Comentario_RRHH` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_layout`
--

CREATE TABLE `dashboard_layout` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `widget_id` varchar(50) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `w` int(11) DEFAULT NULL,
  `h` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Departamentos`
--

CREATE TABLE `Departamentos` (
  `idDepartamento` int(11) NOT NULL,
  `Nombre_departamento` varchar(40) NOT NULL,
  `Descripcion` varchar(200) DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DiasFeriados`
--

CREATE TABLE `DiasFeriados` (
  `idDiaFeriado` bigint(20) NOT NULL,
  `Nombre_asueto` varchar(400) DEFAULT NULL,
  `Fecha_asueto` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Dias_solicitados`
--

CREATE TABLE `Dias_solicitados` (
  `idSolicitud` bigint(20) NOT NULL,
  `dias` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Empresa`
--

CREATE TABLE `Empresa` (
  `idEmpresa` int(11) NOT NULL,
  `Nombre_empresa` varchar(40) NOT NULL,
  `Estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entrevistas`
--

CREATE TABLE `entrevistas` (
  `entrevistaId` int(11) NOT NULL,
  `empleadoId` bigint(20) NOT NULL,
  `entrevistadorId` bigint(20) NOT NULL,
  `fechaEntrevista` timestamp NULL DEFAULT current_timestamp(),
  `completada` tinyint(1) DEFAULT 0,
  `comentariosAdmin` text DEFAULT NULL,
  `comentariosColaborador` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
--

CREATE TABLE `eventos` (
  `eventoId` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaInicio` date NOT NULL,
  `horaInicio` time NOT NULL,
  `fechaFin` date DEFAULT NULL,
  `horaFin` time DEFAULT NULL,
  `tipoId` int(11) NOT NULL,
  `usuarioId` bigint(20) NOT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `diaCompleto` tinyint(1) DEFAULT NULL,
  `entrevistadorId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Faltas_administrativas`
--

CREATE TABLE `Faltas_administrativas` (
  `idFalta` bigint(20) NOT NULL,
  `idUsuario` bigint(20) DEFAULT NULL,
  `Fecha_asignacion_falta` date NOT NULL,
  `Motivo` text DEFAULT NULL,
  `archivo` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Lider_departamento`
--

CREATE TABLE `Lider_departamento` (
  `idUsuario` bigint(20) NOT NULL,
  `idDepartamento` int(11) NOT NULL,
  `Fecha_asignacion` date NOT NULL,
  `Fecha_finalizacion` date DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Pertenece`
--

CREATE TABLE `Pertenece` (
  `idUsuario` bigint(20) NOT NULL,
  `idDepartamento` int(11) NOT NULL,
  `Fecha_asignacion` date DEFAULT NULL,
  `Fecha_finalizacion` date DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT 1,
  `idEmpresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PerteneceDepa`
--

CREATE TABLE `PerteneceDepa` (
  `idDepartamento` int(11) NOT NULL,
  `idEmpresa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preguntas`
--

CREATE TABLE `preguntas` (
  `preguntaId` int(11) NOT NULL,
  `pregunta` text NOT NULL,
  `descripcionPregunta` text DEFAULT NULL,
  `tipoPregunta` enum('abierta','cerrada') NOT NULL,
  `orden` int(11) NOT NULL,
  `escalaMaxima` int(11) DEFAULT 5,
  `escalaMinima` int(11) DEFAULT 1,
  `activa` tinyint(1) DEFAULT 1,
  `fechaCreacion` timestamp NULL DEFAULT current_timestamp(),
  `fechaModificacion` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Privilegios`
--

CREATE TABLE `Privilegios` (
  `idPrivilegio` bigint(20) NOT NULL,
  `Nombre_privilegio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `respuestas`
--

CREATE TABLE `respuestas` (
  `respuestaId` int(11) NOT NULL,
  `entrevistaId` int(11) NOT NULL,
  `preguntaId` int(11) NOT NULL,
  `textoRespuesta` text DEFAULT NULL,
  `valorRespuesta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reuniones`
--

CREATE TABLE `Reuniones` (
  `idReunion` bigint(20) NOT NULL,
  `Fecha_reunion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `Reuniones`
--
DELIMITER $$
CREATE TRIGGER `insertar_preguntas_default` AFTER INSERT ON `Reuniones` FOR EACH ROW BEGIN
    -- Inserta las 4 preguntas predefinidas para cada nueva reunión
    INSERT INTO preguntas_abiertas (idReunion, pregunta, descripcion) VALUES 
    (NEW.idReunion, 'What are you proud of from the past month?', 'Identify personal or team achievements and progress.'),
    (NEW.idReunion, 'Are you worried, disappointed, or stressed?', 'Evaluate factors that may be affecting employee satisfaction.'),
    (NEW.idReunion, 'What are you currently working on?', 'Understand the current activities of each team member.'),
    (NEW.idReunion, 'What will your goal be for the month?', 'Define short-term objectives and align them with the team vision.');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `idRol` bigint(20) NOT NULL,
  `Nombre_rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Rol_Privilegios`
--

CREATE TABLE `Rol_Privilegios` (
  `idRol` bigint(20) NOT NULL,
  `idPrivilegio` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Solicitudes`
--

CREATE TABLE `Solicitudes` (
  `idSolicitud` bigint(20) NOT NULL,
  `idUsuario` bigint(20) DEFAULT NULL,
  `Tipo` varchar(50) NOT NULL,
  `Fecha_inicio` date NOT NULL,
  `Fecha_fin` date NOT NULL,
  `Descripcion` varchar(500) DEFAULT NULL,
  `Aprobacion_L` varchar(15) DEFAULT 'Pendiente',
  `Fecha_aprob_L` date DEFAULT NULL,
  `Aprobacion_A` varchar(15) DEFAULT 'Pendiente',
  `Fecha_aprob_A` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tiposEvento`
--

CREATE TABLE `tiposEvento` (
  `tipo_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `color` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User_Rol`
--

CREATE TABLE `User_Rol` (
  `idUsuario` bigint(20) NOT NULL,
  `idRol` bigint(20) NOT NULL,
  `Fecha_asignacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Usuarios`
--

CREATE TABLE `Usuarios` (
  `idUsuario` bigint(20) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Contrasena` varchar(100) NOT NULL,
  `Apellidos` varchar(100) NOT NULL,
  `Correo_electronico` varchar(100) NOT NULL,
  `Fecha_inicio_colab` date NOT NULL,
  `Fecha_vencimiento_colab` date DEFAULT NULL,
  `Ciudad` varchar(60) DEFAULT NULL,
  `Pais` varchar(60) DEFAULT NULL,
  `Calle` varchar(60) DEFAULT NULL,
  `Modalidad` varchar(20) DEFAULT NULL,
  `Estatus` tinyint(1) DEFAULT 1,
  `dias_vaciones` int(11) DEFAULT NULL,
  `Primera_vez` tinyint(1) DEFAULT 1,
  `google_id` varchar(255) DEFAULT NULL,
  `google_token` text DEFAULT NULL,
  `primer_tuto` int(11) DEFAULT 0,
  `Telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Usuarios_Privilegios`
--

CREATE TABLE `Usuarios_Privilegios` (
  `idUsuario` bigint(20) NOT NULL,
  `idPrivilegio` bigint(20) NOT NULL,
  `Fecha_asignacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comentarios`
--
ALTER TABLE `Comentarios`
  ADD PRIMARY KEY (`idComentario`),
  ADD KEY `idReunion` (`idReunion`);

--
-- Indexes for table `dashboard_layout`
--
ALTER TABLE `dashboard_layout`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Departamentos`
--
ALTER TABLE `Departamentos`
  ADD PRIMARY KEY (`idDepartamento`);

--
-- Indexes for table `DiasFeriados`
--
ALTER TABLE `DiasFeriados`
  ADD PRIMARY KEY (`idDiaFeriado`);

--
-- Indexes for table `Dias_solicitados`
--
ALTER TABLE `Dias_solicitados`
  ADD PRIMARY KEY (`idSolicitud`);

--
-- Indexes for table `Empresa`
--
ALTER TABLE `Empresa`
  ADD PRIMARY KEY (`idEmpresa`);

--
-- Indexes for table `entrevistas`
--
ALTER TABLE `entrevistas`
  ADD PRIMARY KEY (`entrevistaId`),
  ADD KEY `empleadoId` (`empleadoId`),
  ADD KEY `entrevistadorId` (`entrevistadorId`),
  ADD KEY `fechaEntrevista` (`fechaEntrevista`);

--
-- Indexes for table `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`eventoId`),
  ADD KEY `tipoId` (`tipoId`),
  ADD KEY `usuarioId` (`usuarioId`),
  ADD KEY `fk_evento_entrevistador` (`entrevistadorId`);

--
-- Indexes for table `Faltas_administrativas`
--
ALTER TABLE `Faltas_administrativas`
  ADD PRIMARY KEY (`idFalta`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indexes for table `Lider_departamento`
--
ALTER TABLE `Lider_departamento`
  ADD PRIMARY KEY (`idUsuario`,`idDepartamento`),
  ADD KEY `idDepartamento` (`idDepartamento`);

--
-- Indexes for table `Pertenece`
--
ALTER TABLE `Pertenece`
  ADD PRIMARY KEY (`idUsuario`,`idDepartamento`),
  ADD KEY `idDepartamento` (`idDepartamento`);

--
-- Indexes for table `PerteneceDepa`
--
ALTER TABLE `PerteneceDepa`
  ADD KEY `fk_empresa` (`idEmpresa`),
  ADD KEY `fk_departamento` (`idDepartamento`);

--
-- Indexes for table `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`preguntaId`),
  ADD UNIQUE KEY `orden` (`orden`,`activa`);

--
-- Indexes for table `Privilegios`
--
ALTER TABLE `Privilegios`
  ADD PRIMARY KEY (`idPrivilegio`);

--
-- Indexes for table `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`respuestaId`),
  ADD UNIQUE KEY `entrevistaId` (`entrevistaId`,`preguntaId`),
  ADD KEY `preguntaId` (`preguntaId`);

--
-- Indexes for table `Reuniones`
--
ALTER TABLE `Reuniones`
  ADD PRIMARY KEY (`idReunion`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`idRol`);

--
-- Indexes for table `Rol_Privilegios`
--
ALTER TABLE `Rol_Privilegios`
  ADD PRIMARY KEY (`idRol`,`idPrivilegio`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- Indexes for table `Solicitudes`
--
ALTER TABLE `Solicitudes`
  ADD PRIMARY KEY (`idSolicitud`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indexes for table `tiposEvento`
--
ALTER TABLE `tiposEvento`
  ADD PRIMARY KEY (`tipo_id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `User_Rol`
--
ALTER TABLE `User_Rol`
  ADD PRIMARY KEY (`idUsuario`,`idRol`),
  ADD KEY `idRol` (`idRol`);

--
-- Indexes for table `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `Correo_electronico` (`Correo_electronico`);

--
-- Indexes for table `Usuarios_Privilegios`
--
ALTER TABLE `Usuarios_Privilegios`
  ADD PRIMARY KEY (`idUsuario`,`idPrivilegio`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Comentarios`
--
ALTER TABLE `Comentarios`
  MODIFY `idComentario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard_layout`
--
ALTER TABLE `dashboard_layout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Departamentos`
--
ALTER TABLE `Departamentos`
  MODIFY `idDepartamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DiasFeriados`
--
ALTER TABLE `DiasFeriados`
  MODIFY `idDiaFeriado` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Dias_solicitados`
--
ALTER TABLE `Dias_solicitados`
  MODIFY `idSolicitud` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Empresa`
--
ALTER TABLE `Empresa`
  MODIFY `idEmpresa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entrevistas`
--
ALTER TABLE `entrevistas`
  MODIFY `entrevistaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `eventoId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Faltas_administrativas`
--
ALTER TABLE `Faltas_administrativas`
  MODIFY `idFalta` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `preguntaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Privilegios`
--
ALTER TABLE `Privilegios`
  MODIFY `idPrivilegio` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `respuestaId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Reuniones`
--
ALTER TABLE `Reuniones`
  MODIFY `idReunion` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `idRol` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Solicitudes`
--
ALTER TABLE `Solicitudes`
  MODIFY `idSolicitud` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tiposEvento`
--
ALTER TABLE `tiposEvento`
  MODIFY `tipo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `idUsuario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comentarios`
--
ALTER TABLE `Comentarios`
  ADD CONSTRAINT `Comentarios_ibfk_1` FOREIGN KEY (`idReunion`) REFERENCES `Reuniones` (`idReunion`);

--
-- Constraints for table `Dias_solicitados`
--
ALTER TABLE `Dias_solicitados`
  ADD CONSTRAINT `Dias_solicitados_ibfk_1` FOREIGN KEY (`idSolicitud`) REFERENCES `Solicitudes` (`idSolicitud`);

--
-- Constraints for table `entrevistas`
--
ALTER TABLE `entrevistas`
  ADD CONSTRAINT `entrevistas_ibfk_1` FOREIGN KEY (`empleadoId`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `entrevistas_ibfk_2` FOREIGN KEY (`entrevistadorId`) REFERENCES `Usuarios` (`idUsuario`);

--
-- Constraints for table `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`tipoId`) REFERENCES `tiposEvento` (`tipo_id`),
  ADD CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `fk_evento_entrevistador` FOREIGN KEY (`entrevistadorId`) REFERENCES `Usuarios` (`idUsuario`);

--
-- Constraints for table `Faltas_administrativas`
--
ALTER TABLE `Faltas_administrativas`
  ADD CONSTRAINT `Faltas_administrativas_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);

--
-- Constraints for table `Lider_departamento`
--
ALTER TABLE `Lider_departamento`
  ADD CONSTRAINT `Lider_departamento_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `Lider_departamento_ibfk_2` FOREIGN KEY (`idDepartamento`) REFERENCES `Departamentos` (`idDepartamento`);

--
-- Constraints for table `Pertenece`
--
ALTER TABLE `Pertenece`
  ADD CONSTRAINT `Pertenece_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `Pertenece_ibfk_2` FOREIGN KEY (`idDepartamento`) REFERENCES `Departamentos` (`idDepartamento`);

--
-- Constraints for table `PerteneceDepa`
--
ALTER TABLE `PerteneceDepa`
  ADD CONSTRAINT `fk_departamento` FOREIGN KEY (`idDepartamento`) REFERENCES `Departamentos` (`idDepartamento`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_empresa` FOREIGN KEY (`idEmpresa`) REFERENCES `Empresa` (`idEmpresa`) ON DELETE SET NULL,
  ADD CONSTRAINT `idEmpresa` FOREIGN KEY (`idEmpresa`) REFERENCES `Empresa` (`idEmpresa`) ON DELETE SET NULL;

--
-- Constraints for table `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`entrevistaId`) REFERENCES `entrevistas` (`entrevistaId`) ON DELETE CASCADE,
  ADD CONSTRAINT `respuestas_ibfk_2` FOREIGN KEY (`preguntaId`) REFERENCES `preguntas` (`preguntaId`);

--
-- Constraints for table `Rol_Privilegios`
--
ALTER TABLE `Rol_Privilegios`
  ADD CONSTRAINT `Rol_Privilegios_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `Roles` (`idRol`),
  ADD CONSTRAINT `Rol_Privilegios_ibfk_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `Privilegios` (`idPrivilegio`);

--
-- Constraints for table `Solicitudes`
--
ALTER TABLE `Solicitudes`
  ADD CONSTRAINT `Solicitudes_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);

--
-- Constraints for table `User_Rol`
--
ALTER TABLE `User_Rol`
  ADD CONSTRAINT `User_Rol_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `User_Rol_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `Roles` (`idRol`);

--
-- Constraints for table `Usuarios_Privilegios`
--
ALTER TABLE `Usuarios_Privilegios`
  ADD CONSTRAINT `Usuarios_Privilegios_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`),
  ADD CONSTRAINT `Usuarios_Privilegios_ibfk_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `Privilegios` (`idPrivilegio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
