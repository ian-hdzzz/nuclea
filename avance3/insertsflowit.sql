USE nucleaflowit;

-- Llenado de la tabla Roles (Clasificación) (esta bien)
INSERT INTO Roles (idRol, Nombre_rol) VALUES
(1, 'Superadmin'),  -- Solo puede haber un Superadmin
(2, 'Líder'),       -- Rol para líderes de departamento
(3, 'Colaborador'); -- Rol para colaboradores

-- Llenado de la tabla Privilegios (Clasificación) (esta bien)
INSERT INTO Privilegios (idPrivilegio, Nombre_privilegio) VALUES
(1, 'Crear usuarios'),
(2, 'Eliminar usuarios'),
(3, 'Asignar roles'),
(4, 'Gestionar departamentos'),
(5, 'Aprobar solicitudes'),
(6, 'Ver reportes'),
(7, 'Crear KPIs'),
(8, 'Asignar tareas'),
(9, 'Gestionar reuniones'),
(10, 'Comentar en reuniones'),
(11, 'Editar usuarios'),
(12, 'Asignar permisos'),
(13, 'Gestionar proyectos'),
(14, 'Revisar tareas'),
(15, 'Generar informes'),
(16, 'Configurar sistema'),
(17, 'Supervisar equipos'),
(18, 'Acceder a auditorías'),
(19, 'Gestionar capacitaciones'),
(20, 'Aprobar presupuestos');

-- Llenado de la tabla Rol_Privilegios (Asociación) (esta bien)
INSERT INTO Rol_Privilegios (idRol, idPrivilegio) VALUES
-- Superadmin tiene todos los privilegios
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
-- Líder tiene privilegios limitados
(2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 13), (2, 14), (2, 17), (2, 20),
-- Colaborador tiene privilegios básicos
(3, 6), (3, 8), (3, 10), (3, 11), (3, 14);

-- Inserción de los departamentos corregidos (esta bien)
INSERT INTO Departamentos (idDepartamento, Nombre_departamento, Descripcion, Estado) VALUES
(1, 'Software Development', 'Equipo encargado del desarrollo y mantenimiento de software.', TRUE),
(2, 'Talento Humano', 'Departamento responsable de la gestión del personal y el bienestar de los empleados.', TRUE),
(3, 'ZigZag House', 'Área dedicada a proyectos creativos y estrategias innovadoras.', TRUE),
(4, 'UX/UI', 'Equipo especializado en diseño de experiencia de usuario e interfaces.', TRUE),
(5, 'Finanzas', 'Departamento encargado de la gestión financiera y contable de la empresa.', TRUE),
(6, 'Digital Solutions', 'Equipo enfocado en soluciones digitales y transformación tecnológica.', TRUE),
(7, 'Business Analysis Management', 'Área responsable del análisis y gestión de proyectos de negocio.', TRUE),
(8, 'Motion Graphics', 'Equipo dedicado a la creación de gráficos en movimiento y animaciones.', TRUE),
(9, 'Research and Development', 'Departamento de investigación y desarrollo de nuevos productos y tecnologías.', TRUE),
(10, 'Audiovisuales/QA Designer', 'Equipo encargado de la producción audiovisual y el control de calidad en diseño.', TRUE);

-- 50 usuarios representativos (esta bien)
INSERT INTO Usuarios (idUsuario, Nombre, Contrasena, Apellidos, Correo_electronico, Fecha_inicio_colab, Fecha_vencimiento_colab, Ciudad, Pais, Calle, Modalidad, Estatus) VALUES
(1, 'Juan', 'JuanP2020!', 'Pérez', 'juan.perez@nucleaflowit.com', '2020-01-15', NULL, 'Madrid', 'España', 'Calle Mayor 1, Edificio Central', 'Presencial', TRUE),
(2, 'Ana', 'AnaG_2020#', 'Gómez', 'ana.gomez@nucleaflowit.com', '2020-02-20', NULL, 'Barcelona', 'España', 'Avenida Gran Vía 2, Oficina 3B', 'Remoto', TRUE),
(3, 'Carlos', 'CarlosL2020$', 'López', 'carlos.lopez@nucleaflowit.com', '2020-03-10', NULL, 'Valencia', 'España', 'Calle Colón 3, Bloque A', 'Híbrido', TRUE),
(4, 'María', 'MariaM2020%', 'Martínez', 'maria.martinez@nucleaflowit.com', '2020-04-05', NULL, 'Sevilla', 'España', 'Calle Sierpes 4, Apartamento 2C', 'Presencial', TRUE),
(5, 'Luis', 'LuisR2020&', 'Rodríguez', 'luis.rodriguez@nucleaflowit.com', '2020-05-12', NULL, 'Zaragoza', 'España', 'Calle Alfonso 5, Piso 3', 'Remoto', TRUE),
(6, 'Laura', 'LauraS2020@', 'Sánchez', 'laura.sanchez@nucleaflowit.com', '2020-06-18', NULL, 'Málaga', 'España', 'Avenida Larios 6, Edificio Málaga Center', 'Híbrido', TRUE),
(7, 'Pedro', 'PedroF2020!', 'Fernández', 'pedro.fernandez@nucleaflowit.com', '2020-07-22', NULL, 'Murcia', 'España', 'Calle Trapería 7, Portal 4', 'Presencial', TRUE),
(8, 'Sofía', 'SofiaD2020#', 'Díaz', 'sofia.diaz@nucleaflowit.com', '2020-08-30', NULL, 'Palma', 'España', 'Calle Jaime III 8, Departamento 12', 'Remoto', TRUE),
(9, 'Javier', 'JavierR2020$', 'Ruiz', 'javier.ruiz@nucleaflowit.com', '2020-09-25', NULL, 'Bilbao', 'España', 'Gran Vía 9, Oficina 5B', 'Híbrido', TRUE),
(10, 'Marta', 'MartaH2020%', 'Hernández', 'marta.hernandez@nucleaflowit.com', '2020-10-10', NULL, 'Alicante', 'España', 'Paseo Explanada 10, Torre 3', 'Presencial', TRUE),
(11, 'Diego', 'Dg0@4567!', 'Jiménez', 'diego.jimenez@nucleaflowit.com', '2020-11-15', NULL, 'Córdoba', 'España', 'Avenida Cruz Conde, edificio 11', 'Remoto', TRUE),
(12, 'Elena', 'E1eN@990', 'Moreno', 'elena.moreno@nucleaflowit.com', '2020-12-20', NULL, 'Valladolid', 'España', 'Plaza Mayor, número 12', 'Híbrido', TRUE),
(13, 'Pablo', 'P@bl0!321', 'Álvarez', 'pablo.alvarez@nucleaflowit.com', '2021-01-05', NULL, 'Vigo', 'España', 'Calle Príncipe, cerca del parque', 'Presencial', TRUE),
(14, 'Lucía', 'Luci@*786', 'Romero', 'lucia.romero@nucleaflowit.com', '2021-02-10', NULL, 'Gijón', 'España', 'Avenida Corrida, sector 14', 'Remoto', TRUE),
(15, 'Raúl', 'R@ul_554', 'Navarro', 'raul.navarro@nucleaflowit.com', '2021-03-15', NULL, 'Hospitalet', 'España', 'Gran Vía, bloque 15', 'Híbrido', TRUE),
(16, 'Carmen', 'CarMen!007', 'Torres', 'carmen.torres@nucleaflowit.com', '2021-04-20', NULL, 'A Coruña', 'España', 'Calle Real, junto a la plaza 16', 'Presencial', TRUE),
(17, 'Alberto', 'A1bert0@12', 'Domínguez', 'alberto.dominguez@nucleaflowit.com', '2021-05-25', NULL, 'Santander', 'España', 'Paseo Pereda, cerca del muelle', 'Remoto', TRUE),
(18, 'Isabel', 'Is@b3l$99', 'Vázquez', 'isabel.vazquez@nucleaflowit.com', '2021-06-30', NULL, 'Pamplona', 'España', 'Calle Estafeta, en el casco viejo', 'Híbrido', TRUE),
(19, 'Fernando', 'Fern@ndo_001', 'Ramos', 'fernando.ramos@nucleaflowit.com', '2021-07-05', NULL, 'Logroño', 'España', 'Avenida Portales, frente a la catedral', 'Presencial', TRUE),
(20, 'Patricia', 'P@triCia77', 'Gil', 'patricia.gil@nucleaflowit.com', '2021-08-10', NULL, 'Santa Cruz de Tenerife', 'España', 'Calle Castillo, esquina con el mercado', 'Remoto', TRUE),
(21, 'Roberto', 'Rob3rt0@456', 'Castro', 'roberto.castro@nucleaflowit.com', '2022-01-10', '2023-01-10', 'Madrid', 'España', 'Calle Sol, acceso peatonal 21', 'Remoto', FALSE),
(22, 'Andrea', 'Andr3@__789', 'Méndez', 'andrea.mendez@nucleaflowit.com', '2022-02-15', '2023-02-15', 'Barcelona', 'España', 'Avenida Diagonal, cerca del centro 22', 'Presencial', FALSE),
(23, 'Daniel', 'D@niel#874', 'Ortiz', 'daniel.ortiz@nucleaflowit.com', '2022-03-20', '2023-03-20', 'Valencia', 'España', 'Calle Serranos, edificio 23', 'Híbrido', FALSE),
(24, 'Paola', 'P@ola_2023!', 'Vega', 'paola.vega@nucleaflowit.com', '2022-04-25', '2023-04-25', 'Sevilla', 'España', 'Calle Feria, en el casco histórico', 'Remoto', FALSE),
(25, 'Guillermo', 'Gu!ll3rm0*88', 'Ramírez', 'guillermo.ramirez@nucleaflowit.com', '2022-05-30', '2023-05-30', 'Zaragoza', 'España', 'Calle Coso, a un paso del río', 'Presencial', FALSE),
(26, 'Natalia', 'N@tali@_xyz', 'Paredes', 'natalia.paredes@nucleaflowit.com', '2022-06-05', '2023-06-05', 'Málaga', 'España', 'Calle Larios, junto a la catedral', 'Híbrido', FALSE),
(27, 'Hugo', 'Hug0_###', 'Santos', 'hugo.santos@nucleaflowit.com', '2022-07-10', '2023-07-10', 'Murcia', 'España', 'Calle Trapería, en zona comercial', 'Remoto', FALSE),
(28, 'Elisa', 'EliS@_147', 'Navarro', 'elisa.navarro@nucleaflowit.com', '2022-08-15', '2023-08-15', 'Palma', 'España', 'Calle Jaime III, cerca del puerto', 'Presencial', FALSE),
(29, 'Ricardo', 'R!cardo@_', 'Luna', 'ricardo.luna@nucleaflowit.com', '2022-09-20', '2023-09-20', 'Bilbao', 'España', 'Calle Gran Vía, sector financiero', 'Híbrido', FALSE),
(30, 'Isabella', 'Isab3L!9', 'Torres', 'isabella.torres@nucleaflowit.com', '2022-10-25', '2023-10-25', 'Alicante', 'España', 'Calle Explanada, cerca del mar', 'Remoto', FALSE),
(31, 'Fernando', 'FerNand0_789', 'Morales', 'fernando.morales@nucleaflowit.com', '2022-11-30', '2023-11-30', 'Córdoba', 'España', 'Calle Cruz Conde, cerca del casco histórico', 'Presencial', FALSE),
(32, 'Silvia', 'S1lv!a_XP', 'Gómez', 'silvia.gomez@nucleaflowit.com', '2022-12-05', '2023-12-05', 'Valladolid', 'España', 'Calle Santiago, en zona comercial', 'Híbrido', FALSE),
(33, 'Alejandro', 'Alex_2024!$', 'Ruiz', 'alejandro.ruiz@nucleaflowit.com', '2023-01-10', NULL, 'Vigo', 'España', 'Calle Príncipe, en el centro cultural', 'Remoto', TRUE),
(34, 'Luciana', 'Luci@na_M8', 'Ramírez', 'luciana.ramirez@nucleaflowit.com', '2023-02-15', NULL, 'Gijón', 'España', 'Calle Corrida, en el centro histórico', 'Presencial', TRUE),
(35, 'Gabriel', 'GabR!el_93', 'Serrano', 'gabriel.serrano@nucleaflowit.com', '2023-03-20', NULL, 'Hospitalet', 'España', 'Calle Gran Vía, en el distrito tecnológico', 'Híbrido', TRUE),
(36, 'Valeria', 'ValeriaO2019&', 'Ortega', 'valeria.ortega@nucleaflowit.com', '2019-01-10', '2020-01-10', 'Madrid', 'España', 'Calle Mayor 36, Edificio Sol', 'Remoto', FALSE),
(37, 'Martín', 'MartinL2019@', 'López', 'martin.lopez@nucleaflowit.com', '2019-02-15', '2020-02-15', 'Barcelona', 'España', 'Avenida Gran Vía 37, Bloque 2', 'Presencial', FALSE),
(38, 'Florencia', 'FlorenciaM2019!', 'Mendoza', 'florencia.mendoza@nucleaflowit.com', '2019-03-20', '2020-03-20', 'Valencia', 'España', 'Calle Colón 38, Piso 4B', 'Híbrido', FALSE),
(39, 'Santiago', 'SantiagoG2019#', 'García', 'santiago.garcia@nucleaflowit.com', '2019-04-25', '2020-04-25', 'Sevilla', 'España', 'Calle Sierpes 39, Apartamento 8', 'Remoto', FALSE),
(40, 'Camila', 'CamilaD2019$', 'Duarte', 'camila.duarte@nucleaflowit.com', '2019-05-30', '2020-05-30', 'Zaragoza', 'España', 'Calle Alfonso 40, Edificio Central', 'Presencial', FALSE),
(41, 'Matías', 'MatiasR2019%', 'Ríos', 'matias.rios@nucleaflowit.com', '2019-06-05', '2020-06-05', 'Málaga', 'España', 'Avenida Larios 41, Torre 2', 'Híbrido', FALSE),
(42, 'Clara', 'ClaraB2019&', 'Benítez', 'clara.benitez@nucleaflowit.com', '2019-07-10', '2020-07-10', 'Murcia', 'España', 'Calle Trapería 42, Bloque 1', 'Remoto', FALSE),
(43, 'Joaquín', 'JoaquinS2019@', 'Silva', 'joaquin.silva@nucleaflowit.com', '2019-08-15', '2020-08-15', 'Palma', 'España', 'Calle Jaime III 43, Apartamento 5A', 'Presencial', FALSE),
(44, 'Emilia', 'EmiliaV2019!', 'Vargas', 'emilia.vargas@nucleaflowit.com', '2019-09-20', '2020-09-20', 'Bilbao', 'España', 'Gran Vía 44, Oficina 7', 'Híbrido', FALSE),
(45, 'Damián', 'DamianP2019#', 'Pérez', 'damian.perez@nucleaflowit.com', '2019-10-25', '2020-10-25', 'Alicante', 'España', 'Paseo Explanada 45, Edificio Mar', 'Remoto', FALSE),
(46, 'Federico', 'FedericoM2023$', 'Molina', 'federico.molina@nucleaflowit.com', '2023-01-01', NULL, 'Madrid', 'España', 'Calle Alcalá 46, Piso 3', 'Remoto', TRUE),
(47, 'Renata', 'RenataG2023%', 'Guzmán', 'renata.guzman@nucleaflowit.com', '2023-02-01', NULL, 'Barcelona', 'España', 'Calle Diagonal 47, Apartamento 2A', 'Presencial', TRUE),
(48, 'Héctor', 'HectorP2023&', 'Paredes', 'hector.paredes@nucleaflowit.com', '2023-03-01', NULL, 'Valencia', 'España', 'Calle Serranos 48, Bloque B', 'Híbrido', TRUE),
(49, 'Nicolás', 'NicolasS2023@', 'Santana', 'nicolas.santana@nucleaflowit.com', '2023-04-01', NULL, 'Sevilla', 'España', 'Calle Feria 49, Torre 5', 'Remoto', TRUE),
(50, 'Tatiana', 'TatianaV2023!', 'Villanueva', 'tatiana.villanueva@nucleaflowit.com', '2023-05-01', NULL, 'Zaragoza', 'España', 'Calle Coso 50, Oficina 8', 'Presencial', TRUE);

-- Inserción de KPIs
INSERT INTO KPIs (idKpi, idUsuario, idUsuario_LoA, Nombre_KPI, Estatus, Progreso, Fecha_tentativa) VALUES
(1, 1, 2, 'Desarrollar nueva funcionalidad', 'En progreso', 50, '2025-06-01'),
(2, 3, 4, 'Diseñar nueva interfaz', 'En progreso', 30, '2025-07-01'),
(3, 5, 6, 'Mejorar soporte técnico', 'En progreso', 20, '2025-08-01'),
(4, 7, 8, 'Incrementar ventas', 'En progreso', 40, '2025-09-01'),
(5, 9, 10, 'Crear campaña de marketing', 'En progreso', 60, '2025-10-01'),
(6, 11, 12, 'Optimizar recursos humanos', 'En progreso', 70, '2025-11-01'),
(7, 13, 14, 'Gestionar presupuesto', 'En progreso', 80, '2025-12-01'),
(8, 15, 16, 'Mejorar operaciones', 'En progreso', 50, '2026-01-01'),
(9, 17, 18, 'Asegurar calidad', 'En progreso', 30, '2026-02-01'),
(10, 19, 20, 'Innovar en productos', 'En progreso', 20, '2026-03-01'),
(11, 2, 2, 'Revisar código', 'En progreso', 40, '2025-06-15'),
(12, 4, 4, 'Actualizar diseño', 'En progreso', 50, '2025-07-15'),
(13, 6, 6, 'Capacitar equipo', 'En progreso', 60, '2025-08-15'),
(14, 8, 8, 'Analizar mercado', 'En progreso', 70, '2025-09-15'),
(15, 10, 10, 'Lanzar campaña', 'En progreso', 80, '2025-10-15'),
(16, 12, 12, 'Evaluar desempeño', 'En progreso', 90, '2025-11-15'),
(17, 14, 14, 'Reducir costos', 'En progreso', 50, '2025-12-15'),
(18, 16, 16, 'Optimizar procesos', 'En progreso', 30, '2026-01-15'),
(19, 18, 18, 'Control de calidad', 'En progreso', 20, '2026-02-15'),
(20, 20, 20, 'Desarrollar prototipo', 'En progreso', 40, '2026-03-15'),
(21, 1, 2, 'Implementar seguridad', 'En progreso', 50, '2025-06-20'),
(22, 3, 4, 'Crear wireframes', 'En progreso', 30, '2025-07-20'),
(23, 5, 6, 'Mejorar atención al cliente', 'En progreso', 20, '2025-08-20'),
(24, 7, 8, 'Aumentar conversiones', 'En progreso', 40, '2025-09-20'),
(25, 9, 10, 'Desarrollar estrategia', 'En progreso', 60, '2025-10-20'),
(26, 11, 12, 'Reclutar talento', 'En progreso', 70, '2025-11-20'),
(27, 13, 14, 'Gestionar inversiones', 'En progreso', 80, '2025-12-20'),
(28, 15, 16, 'Mejorar logística', 'En progreso', 50, '2026-01-20'),
(29, 17, 18, 'Realizar auditoría', 'En progreso', 30, '2026-02-20'),
(30, 19, 20, 'Desarrollar innovación', 'En progreso', 20, '2026-03-20'),
(31, 2, 2, 'Documentar procesos', 'En progreso', 40, '2025-06-25'),
(32, 4, 4, 'Crear prototipos', 'En progreso', 50, '2025-07-25'),
(33, 6, 6, 'Mejorar soporte', 'En progreso', 60, '2025-08-25'),
(34, 8, 8, 'Analizar datos', 'En progreso', 70, '2025-09-25'),
(35, 10, 10, 'Lanzar producto', 'En progreso', 80, '2025-10-25'),
(36, 12, 12, 'Evaluar rendimiento', 'En progreso', 90, '2025-11-25'),
(37, 14, 14, 'Reducir gastos', 'En progreso', 50, '2025-12-25'),
(38, 16, 16, 'Optimizar operaciones', 'En progreso', 30, '2026-01-25'),
(39, 18, 18, 'Control de procesos', 'En progreso', 20, '2026-02-25'),
(40, 20, 20, 'Desarrollar tecnología', 'En progreso', 40, '2026-03-25'),
(41, 1, 2, 'Implementar mejoras', 'En progreso', 50, '2025-06-30'),
(42, 3, 4, 'Crear maquetas', 'En progreso', 30, '2025-07-30'),
(43, 5, 6, 'Mejorar servicio', 'En progreso', 20, '2025-08-30'),
(44, 7, 8, 'Aumentar ventas', 'En progreso', 40, '2025-09-30'),
(45, 9, 10, 'Desarrollar plan', 'En progreso', 60, '2025-10-30'),
(46, 11, 12, 'Contratar personal', 'En progreso', 70, '2025-11-30'),
(47, 13, 14, 'Gestionar fondos', 'En progreso', 80, '2025-12-30'),
(48, 15, 16, 'Mejorar distribución', 'En progreso', 50, '2026-01-30'),
(49, 17, 18, 'Realizar control', 'En progreso', 30, '2026-02-28'),
(50, 19, 20, 'Desarrollar innovación', 'En progreso', 20, '2026-03-30');

-- Inserción de Tareas
INSERT INTO Tareas (idTarea, idKPI, Nombre_tarea, Descripcion, Estatus, Evidencia) VALUES
(1, 1, 'Analizar requisitos', 'Analizar requisitos de la nueva funcionalidad', 'Completada', 'documento_requisitos.pdf'),
(2, 1, 'Desarrollar autenticación', 'Desarrollar el módulo de autenticación', 'En progreso', ''),
(3, 2, 'Crear bocetos UI', 'Crear bocetos iniciales de la interfaz', 'Completada', 'bocetos_ui.png'),
(4, 2, 'Prototipos interactivos', 'Desarrollar prototipos interactivos', 'En progreso', ''),
(5, 3, 'Revisar tickets soporte', 'Revisar tickets de soporte pendientes', 'Completada', 'tickets_resueltos.xlsx'),
(6, 3, 'Capacitar equipo soporte', 'Capacitar al equipo de soporte', 'En progreso', ''),
(7, 4, 'Identificar oportunidades', 'Identificar oportunidades de ventas', 'En progreso', ''),
(8, 4, 'Contactar clientes', 'Contactar a clientes potenciales', 'Pendiente', ''),
(9, 5, 'Diseñar material publicitario', 'Diseñar material publicitario', 'Completada', 'brochure_final.pdf'),
(10, 5, 'Campaña en redes', 'Planificar la campaña en redes sociales', 'En progreso', ''),
(11, 6, 'Evaluar políticas RH', 'Evaluar políticas de recursos humanos', 'En progreso', ''),
(12, 6, 'Estrategias bienestar', 'Implementar nuevas estrategias de bienestar', 'Pendiente', ''),
(13, 7, 'Revisar presupuesto', 'Revisar el presupuesto actual', 'Completada', 'presupuesto_2025.xlsx'),
(14, 7, 'Ajustes financieros', 'Proponer ajustes financieros', 'En progreso', ''),
(15, 8, 'Analizar procesos', 'Analizar procesos operativos', 'Pendiente', ''),
(16, 8, 'Mejoras logísticas', 'Implementar mejoras en la logística', 'En progreso', ''),
(17, 9, 'Auditorías calidad', 'Realizar auditorías de calidad', 'Completada', 'auditoria_calidad.pdf'),
(18, 9, 'Capacitación calidad', 'Capacitar al equipo en control de calidad', 'En progreso', ''),
(19, 10, 'Investigar tecnologías', 'Investigar nuevas tecnologías', 'En progreso', ''),
(20, 10, 'Prototipos productos', 'Desarrollar prototipos de productos', 'Pendiente', ''),
(21, 11, 'Revisar código', 'Revisar código existente', 'Completada', 'reporte_codigo.pdf'),
(22, 11, 'Mejorar código', 'Proponer mejoras en el código', 'En progreso', ''),
(23, 12, 'Actualizar diseño', 'Actualizar elementos de diseño', 'En progreso', ''),
(24, 12, 'Probar interfaz', 'Probar la nueva interfaz con usuarios', 'Pendiente', ''),
(25, 13, 'Sesiones capacitación', 'Organizar sesiones de capacitación', 'Completada', 'registro_sesiones.xlsx'),
(26, 13, 'Evaluar desempeño', 'Evaluar el desempeño del equipo', 'En progreso', ''),
(27, 14, 'Recopilar datos', 'Recopilar datos del mercado', 'Pendiente', ''),
(28, 14, 'Analizar tendencias', 'Analizar tendencias del mercado', 'En progreso', ''),
(29, 15, 'Planificar lanzamiento', 'Planificar el lanzamiento de la campaña', 'Completada', 'plan_lanzamiento.pdf'),
(30, 15, 'Coordinar marketing', 'Coordinar con el equipo de marketing', 'En progreso', ''),
(31, 16, 'Evaluar desempeño equipo', 'Revisar evaluaciones de desempeño', 'En progreso', ''),
(32, 16, 'Mejoras rendimiento', 'Proponer mejoras en el rendimiento', 'Pendiente', ''),
(33, 17, 'Analizar costos', 'Analizar costos actuales', 'Completada', 'reporte_costos.pdf'),
(34, 17, 'Reducir costos', 'Implementar estrategias de reducción de costos', 'En progreso', ''),
(35, 18, 'Revisar procesos', 'Revisar procesos operativos', 'Pendiente', ''),
(36, 18, 'Optimizar procesos', 'Proponer optimizaciones en los procesos', 'En progreso', ''),
(37, 19, 'Controles calidad', 'Realizar controles de calidad', 'Completada', 'control_calidad.xlsx'),
(38, 19, 'Capacitar calidad', 'Capacitar al equipo en estándares de calidad', 'En progreso', ''),
(39, 20, 'Desarrollar prototipos', 'Desarrollar prototipos iniciales', 'En progreso', ''),
(40, 20, 'Probar prototipos', 'Probar prototipos con usuarios', 'Pendiente', ''),
(41, 21, 'Seguridad sistema', 'Implementar medidas de seguridad', 'En progreso', ''),
(42, 22, 'Wireframes UI', 'Crear wireframes iniciales', 'Pendiente', ''),
(43, 23, 'Mejorar atención cliente', 'Mejorar la atención al cliente', 'En progreso', ''),
(44, 24, 'Oportunidades conversión', 'Identificar oportunidades de conversión', 'Pendiente', ''),
(45, 25, 'Estrategia marketing', 'Desarrollar una estrategia de marketing', 'En progreso', ''),
(46, 26, 'Reclutar talento', 'Reclutar nuevo talento', 'Pendiente', ''),
(47, 27, 'Gestión inversiones', 'Gestionar inversiones actuales', 'Completada', 'informe_inversiones.pdf'),
(48, 28, 'Optimizar logística', 'Mejorar la logística de distribución', 'En progreso', ''),
(49, 29, 'Auditorías internas', 'Realizar auditorías internas', 'Pendiente', ''),
(50, 30, 'Innovación productos', 'Desarrollar nuevas ideas de innovación', 'En progreso', '');

INSERT INTO Tareas (idTarea, idKpi, Nombre_tarea, Descripcion, Estatus, Evidencia) VALUES
(51, 26, 'Reclutar nuevo talento', 'Publicación de vacantes y entrevistas iniciales.', 'Pendiente', ''),
(52, 26, 'Evaluar candidatos', 'Revisión de currículums y pruebas técnicas.', 'Pendiente', ''),
(53, 27, 'Gestionar inversiones actuales', 'Revisión del estado de inversiones activas.', 'Pendiente', ''),
(54, 27, 'Proponer nuevas inversiones', 'Análisis de oportunidades de inversión.', 'Pendiente', ''),
(55, 28, 'Mejorar la logística de distribución', 'Optimización de rutas y tiempos de entrega.', 'Pendiente', ''),
(56, 28, 'Optimizar rutas de entrega', 'Implementación de nuevas estrategias logísticas.', 'Pendiente', ''),
(57, 29, 'Realizar auditorías internas', 'Verificación del cumplimiento de procesos internos.', 'Pendiente', ''),
(58, 29, 'Capacitar al equipo en auditorías', 'Sesiones de formación en auditorías.', 'Pendiente', ''),
(59, 30, 'Desarrollar nuevas ideas de innovación', 'Brainstorming con el equipo de I+D.', 'Pendiente', ''),
(60, 30, 'Probar nuevas tecnologías', 'Evaluación de tendencias tecnológicas.', 'Pendiente', ''),
(61, 31, 'Documentar procesos actuales', 'Elaboración de manuales de procesos.', 'Pendiente', ''),
(62, 31, 'Proponer mejoras en la documentación', 'Estandarización de formatos y guías.', 'Pendiente', ''),
(63, 32, 'Crear prototipos iniciales', 'Diseño de wireframes y primeros mockups.', 'Pendiente', ''),
(64, 32, 'Probar prototipos con usuarios', 'Recopilación de feedback en pruebas de usuario.', 'Pendiente', ''),
(65, 33, 'Mejorar el soporte técnico', 'Implementación de un sistema de tickets.', 'Pendiente', ''),
(66, 33, 'Capacitar al equipo de soporte', 'Sesiones de formación técnica.', 'Pendiente', ''),
(67, 34, 'Analizar datos de usuarios', 'Estudio del comportamiento de usuarios.', 'Pendiente', ''),
(68, 34, 'Proponer mejoras basadas en datos', 'Optimización de funcionalidades según métricas.', 'Pendiente', ''),
(69, 35, 'Planificar el lanzamiento del producto', 'Coordinación con los equipos de marketing y desarrollo.', 'Pendiente', ''),
(70, 35, 'Coordinar con el equipo de desarrollo', 'Asegurar integración y testing previo a lanzamiento.', 'Pendiente', ''),
(71, 36, 'Evaluar el rendimiento del equipo', 'Revisión de KPIs de desempeño.', 'Pendiente', ''),
(72, 36, 'Proponer mejoras en el rendimiento', 'Estrategias para aumentar productividad.', 'Pendiente', ''),
(73, 37, 'Analizar gastos actuales', 'Evaluación de costos operativos.', 'Pendiente', ''),
(74, 37, 'Implementar estrategias de reducción de gastos', 'Optimización de presupuestos.', 'Pendiente', ''),
(75, 38, 'Revisar operaciones actuales', 'Análisis de eficiencia operativa.', 'Pendiente', ''),
(76, 38, 'Proponer optimizaciones en las operaciones', 'Implementación de mejoras en procesos.', 'Pendiente', ''),
(77, 39, 'Desarrollar prototipos iniciales', 'Primeros diseños funcionales.', 'Pendiente', ''),
(78, 39, 'Probar prototipos con usuarios', 'Pruebas de validación con clientes.', 'Pendiente', ''),
(79, 40, 'Implementar mejoras tecnológicas', 'Desarrollo de nuevas funcionalidades.', 'Pendiente', ''),
(80, 40, 'Evaluar impacto de las mejoras', 'Análisis post-implementación.', 'Pendiente', ''),
(81, 41, 'Revisar medidas de seguridad', 'Evaluación de vulnerabilidades.', 'Pendiente', ''),
(82, 41, 'Actualizar políticas de seguridad', 'Mejoras en normativas de protección de datos.', 'Pendiente', ''),
(83, 42, 'Crear wireframes detallados', 'Diseño detallado de interfaces.', 'Pendiente', ''),
(84, 42, 'Desarrollar prototipos finales', 'Prototipos de alta fidelidad.', 'Pendiente', ''),
(85, 43, 'Mejorar la calidad del servicio', 'Optimización de procesos de atención.', 'Pendiente', ''),
(86, 43, 'Capacitar al equipo en nuevas técnicas', 'Entrenamiento en servicio al cliente.', 'Pendiente', ''),
(87, 44, 'Identificar nuevas oportunidades de ventas', 'Investigación de mercado.', 'Pendiente', ''),
(88, 44, 'Implementar estrategias de ventas', 'Nuevas tácticas comerciales.', 'Pendiente', ''),
(89, 45, 'Desarrollar un plan de marketing', 'Estrategias para campañas publicitarias.', 'Pendiente', ''),
(90, 45, 'Coordinar con el equipo de marketing', 'Asegurar alineación de mensajes.', 'Pendiente', ''),
(91, 46, 'Contratar nuevo personal', 'Proceso de selección y entrevistas.', 'Pendiente', ''),
(92, 46, 'Evaluar el rendimiento del personal', 'Monitoreo de desempeño.', 'Pendiente', ''),
(93, 47, 'Gestionar fondos actuales', 'Optimización de recursos financieros.', 'Pendiente', ''),
(94, 47, 'Proponer nuevas estrategias financieras', 'Desarrollo de estrategias de inversión.', 'Pendiente', ''),
(95, 48, 'Mejorar la distribución de productos', 'Optimización de stock y envíos.', 'Pendiente', ''),
(96, 48, 'Optimizar la cadena de suministro', 'Mejoras en abastecimiento y logística.', 'Pendiente', ''),
(97, 49, 'Realizar controles internos', 'Verificación de procesos internos.', 'Pendiente', ''),
(98, 49, 'Capacitar al equipo en control interno', 'Sesiones de formación en auditoría.', 'Pendiente', ''),
(99, 50, 'Desarrollar nuevas ideas innovadoras', 'Sesión de brainstorming con equipos.', 'Pendiente', ''),
(100, 50, 'Probar nuevas ideas con usuarios', 'Feedback y pruebas piloto.', 'Pendiente', '');

-- 100 tareas en total, osea 2 por KPI


-- Llenado de la tabla User_Rol (Asociación)
-- Asignación de roles a usuarios (ESTA BIEN)
INSERT INTO User_Rol (idUsuario, idRol, Fecha_asignacion) VALUES
(1, 1, '2020-01-15'), -- Juan es Superadmin
(2, 2, '2020-02-20'), -- Ana es Líder
(3, 3, '2020-03-10'), -- Carlos es Colaborador
(4, 2, '2020-04-05'), -- María es Líder
(5, 3, '2020-05-12'), -- Luis es Colaborador
(6, 2, '2020-06-18'), -- Laura es Líder
(7, 3, '2020-07-22'), -- Pedro es Colaborador
(8, 2, '2020-08-30'), -- Sofía es Líder
(9, 3, '2020-09-25'), -- Javier es Colaborador
(10, 2, '2020-10-10'), -- Marta es Líder
(11, 3, '2020-11-15'), -- Diego es Colaborador
(12, 2, '2020-12-20'), -- Elena es Líder
(13, 3, '2021-01-05'), -- Pablo es Colaborador
(14, 2, '2021-02-10'), -- Lucía es Líder
(15, 3, '2021-03-15'), -- Raúl es Colaborador
(16, 2, '2021-04-20'), -- Carmen es Líder
(17, 3, '2021-05-25'), -- Alberto es Colaborador
(18, 2, '2021-06-30'), -- Isabel es Líder
(19, 3, '2021-07-05'), -- Fernando es Colaborador
(20, 2, '2021-08-10'), -- Patricia es Líder
(21, 3, '2022-01-10'), -- Roberto es Colaborador
(22, 3, '2022-02-15'), -- Andrea es Colaborador
(23, 3, '2022-03-20'), -- Daniel es Colaborador
(24, 3, '2022-04-25'), -- Paola es Colaborador
(25, 3, '2022-05-30'), -- Guillermo es Colaborador
(26, 3, '2022-06-05'), -- Natalia es Colaborador
(27, 3, '2022-07-10'), -- Hugo es Colaborador
(28, 3, '2022-08-15'), -- Elisa es Colaborador
(29, 3, '2022-09-20'), -- Ricardo es Colaborador
(30, 3, '2022-10-25'), -- Isabella es Colaborador
(31, 3, '2022-11-30'), -- Fernando es Colaborador
(32, 3, '2022-12-05'), -- Silvia es Colaborador
(33, 3, '2023-01-10'), -- Alejandro es Colaborador
(34, 3, '2023-02-15'), -- Luciana es Colaborador
(35, 3, '2023-03-20'), -- Gabriel es Colaborador
(36, 3, '2019-01-10'), -- Valeria es Colaborador
(37, 3, '2019-02-15'), -- Martín es Colaborador
(38, 3, '2019-03-20'), -- Florencia es Colaborador
(39, 3, '2019-04-25'), -- Santiago es Colaborador
(40, 3, '2019-05-30'), -- Camila es Colaborador
(41, 3, '2019-06-05'), -- Matías es Colaborador
(42, 3, '2019-07-10'), -- Clara es Colaborador
(43, 3, '2019-08-15'), -- Joaquín es Colaborador
(44, 3, '2019-09-20'), -- Emilia es Colaborador
(45, 3, '2019-10-25'), -- Damián es Colaborador
(46, 3, '2023-01-01'), -- Federico es Colaborador
(47, 3, '2023-02-01'), -- Renata es Colaborador
(48, 3, '2023-03-01'), -- Héctor es Colaborador
(49, 3, '2023-04-01'), -- Nicolás es Colaborador
(50, 3, '2023-05-01'); -- Tatiana es Colaborador

-- Asignación de líderes a departamentos (esta bien), preguntar a ricardo si con estas relaciones de lider_departamento esta bien, con lo de usuario
INSERT INTO Lider_departamento (idUsuario, idDepartamento, Fecha_asignacion, Fecha_finalizacion, Estado) VALUES
(2, 1, '2020-02-20', NULL, TRUE),  -- Ana es líder de Desarrollo
(4, 2, '2020-04-05', NULL, TRUE),  -- María es líder de Diseño
(6, 3, '2020-06-18', NULL, TRUE),  -- Laura es líder de Soporte
(8, 4, '2020-08-30', NULL, TRUE),  -- Sofía es líder de Ventas
(10, 5, '2020-10-10', NULL, TRUE), -- Marta es líder de Marketing
(12, 6, '2020-12-20', NULL, TRUE), -- Elena es líder de Recursos Humanos
(14, 7, '2021-02-10', NULL, TRUE), -- Lucía es líder de Finanzas
(16, 8, '2021-04-20', NULL, TRUE), -- Carmen es líder de Operaciones
(18, 9, '2021-06-30', NULL, TRUE), -- Isabel es líder de Calidad
(20, 10, '2021-08-10', NULL, TRUE); -- Patricia es líder de Innovación

-- Asignación de usuarios a departamentos (esta bien)
INSERT INTO Pertenece (idUsuario, idDepartamento, Fecha_asignacion, Fecha_finalizacion, Estado) VALUES
(1, 1, '2020-01-15', NULL, TRUE),  -- Juan pertenece a Desarrollo
(2, 1, '2020-02-20', NULL, TRUE),  -- Ana pertenece a Desarrollo
(3, 2, '2020-03-10', NULL, TRUE),  -- Carlos pertenece a Diseño
(4, 2, '2020-04-05', NULL, TRUE),  -- María pertenece a Diseño
(5, 3, '2020-05-12', NULL, TRUE),  -- Luis pertenece a Soporte
(6, 3, '2020-06-18', NULL, TRUE),  -- Laura pertenece a Soporte
(7, 4, '2020-07-22', NULL, TRUE),  -- Pedro pertenece a Ventas
(8, 4, '2020-08-30', NULL, TRUE),  -- Sofía pertenece a Ventas
(9, 5, '2020-09-25', NULL, TRUE),  -- Javier pertenece a Marketing
(10, 5, '2020-10-10', NULL, TRUE), -- Marta pertenece a Marketing
(11, 6, '2020-11-15', NULL, TRUE), -- Diego pertenece a Recursos Humanos
(12, 6, '2020-12-20', NULL, TRUE), -- Elena pertenece a Recursos Humanos
(13, 7, '2021-01-05', NULL, TRUE), -- Pablo pertenece a Finanzas
(14, 7, '2021-02-10', NULL, TRUE), -- Lucía pertenece a Finanzas
(15, 8, '2021-03-15', NULL, TRUE), -- Raúl pertenece a Operaciones
(16, 8, '2021-04-20', NULL, TRUE), -- Carmen pertenece a Operaciones
(17, 9, '2021-05-25', NULL, TRUE), -- Alberto pertenece a Calidad
(18, 9, '2021-06-30', NULL, TRUE), -- Isabel pertenece a Calidad
(19, 10, '2021-07-05', NULL, TRUE), -- Fernando pertenece a Innovación
(20, 10, '2021-08-10', NULL, TRUE), -- Patricia pertenece a Innovación
(21, 1, '2022-01-10', '2023-01-10', FALSE), -- Roberto pertenece a Software Development (inactivo)
(22, 2, '2022-02-15', '2023-02-15', FALSE), -- Andrea pertenece a Talento Humano (inactivo)
(23, 3, '2022-03-20', '2023-03-20', FALSE), -- Daniel pertenece a ZigZag House (inactivo)
(24, 4, '2022-04-25', '2023-04-25', FALSE), -- Paola pertenece a UX/UI (inactivo)
(25, 5, '2022-05-30', '2023-05-30', FALSE), -- Guillermo pertenece a Finanzas (inactivo)
(26, 6, '2022-06-05', '2023-06-05', FALSE), -- Natalia pertenece a Digital Solutions (inactivo)
(27, 7, '2022-07-10', '2023-07-10', FALSE), -- Hugo pertenece a Business Analysis Management (inactivo)
(28, 8, '2022-08-15', '2023-08-15', FALSE), -- Elisa pertenece a Motion Graphics (inactivo)
(29, 9, '2022-09-20', '2023-09-20', FALSE), -- Ricardo pertenece a Research and Development (inactivo)
(30, 10, '2022-10-25', '2023-10-25', FALSE), -- Isabella pertenece a Audiovisuales/QA Designer (inactivo)
(31, 1, '2022-11-30', '2023-11-30', FALSE), -- Fernando pertenece a Software Development (inactivo)
(32, 2, '2022-12-05', '2023-12-05', FALSE), -- Silvia pertenece a Talento Humano (inactivo)
(33, 3, '2023-01-10', NULL, TRUE), -- Alejandro pertenece a ZigZag House (activo)
(34, 4, '2023-02-15', NULL, TRUE), -- Luciana pertenece a UX/UI (activo)
(35, 5, '2023-03-20', NULL, TRUE), -- Gabriel pertenece a Finanzas (activo)
(36, 6, '2019-01-10', '2020-01-10', FALSE), -- Valeria pertenece a Digital Solutions (inactivo)
(37, 7, '2019-02-15', '2020-02-15', FALSE), -- Martín pertenece a Business Analysis Management (inactivo)
(38, 8, '2019-03-20', '2020-03-20', FALSE), -- Florencia pertenece a Motion Graphics (inactivo)
(39, 9, '2019-04-25', '2020-04-25', FALSE), -- Santiago pertenece a Research and Development (inactivo)
(40, 10, '2019-05-30', '2020-05-30', FALSE), -- Camila pertenece a Audiovisuales/QA Designer (inactivo)
(41, 1, '2019-06-05', '2020-06-05', FALSE), -- Matías pertenece a Software Development (inactivo)
(42, 2, '2019-07-10', '2020-07-10', FALSE), -- Clara pertenece a Talento Humano (inactivo)
(43, 3, '2019-08-15', '2020-08-15', FALSE), -- Joaquín pertenece a ZigZag House (inactivo)
(44, 4, '2019-09-20', '2020-09-20', FALSE), -- Emilia pertenece a UX/UI (inactivo)
(45, 5, '2019-10-25', '2020-10-25', FALSE), -- Damián pertenece a Finanzas (inactivo)
(46, 6, '2023-01-01', NULL, TRUE), -- Federico pertenece a Digital Solutions (activo)
(47, 7, '2023-02-01', NULL, TRUE), -- Renata pertenece a Business Analysis Management (activo)
(48, 8, '2023-03-01', NULL, TRUE), -- Héctor pertenece a Motion Graphics (activo)
(49, 9, '2023-04-01', NULL, TRUE), -- Nicolás pertenece a Research and Development (activo)
(50, 10, '2023-05-01', NULL, TRUE); -- Tatiana pertenece a Audiovisuales/QA Designer (activo)

-- Inserción de 50 solicitudes con los tipos especificados (esta bien)
INSERT INTO Solicitudes (idSolicitud, idUsuario, idUsuarioL, idUsuarioA, Tipo, Fecha_inicio, Fecha_fin, Descripcion, Aprobacion_L, Fecha_aprob_L, Aprobacion_A, Fecha_aprob_A) VALUES
(1, 3, 4, 1, 'Vacaciones', '2023-01-01', '2023-01-10', 'Solicitud de vacaciones', 'Aprobado', '2023-01-02', 'Aprobado', '2023-01-03'),
(2, 5, 6, 1, 'Enfermedad', '2023-01-05', '2023-01-07', 'Permiso por enfermedad', 'Pendiente', NULL, 'Pendiente', NULL),
(3, 7, 8, 1, 'Situación familiar', '2023-01-10', '2023-01-15', 'Asuntos familiares urgentes', 'Rechazado', '2023-01-11', 'Rechazado', '2023-01-12'),
(4, 9, 10, 1, 'Compromiso Personal', '2023-01-20', '2023-01-30', 'Compromiso personal ineludible', 'Aprobado', '2023-01-21', 'Aprobado', '2023-01-22'),
(5, 11, 12, 1, 'Duelo', '2023-02-01', '2023-02-03', 'Fallecimiento de un familiar', 'Aprobado', '2023-02-02', 'Aprobado', '2023-02-03'),
(6, 13, 14, 1, 'Cita Médico', '2023-02-10', '2023-02-10', 'Cita médica programada', 'Pendiente', NULL, 'Pendiente', NULL),
(7, 15, 16, 1, 'Trámites Oficiales', '2023-02-15', '2023-02-17', 'Renovación de documentos', 'Aprobado', '2023-02-16', 'Aprobado', '2023-02-17'),
(8, 17, 18, 1, 'Emergencia', '2023-02-20', '2023-02-25', 'Emergencia familiar', 'Rechazado', '2023-02-21', 'Rechazado', '2023-02-22'),
(9, 19, 20, 1, 'Descanso Mental', '2023-03-01', '2023-03-10', 'Necesidad de descanso por estrés', 'Aprobado', '2023-03-02', 'Aprobado', '2023-03-03'),
(10, 3, 4, 1, 'Situación Académica', '2023-03-05', '2023-03-07', 'Exámenes universitarios', 'Pendiente', NULL, 'Pendiente', NULL),
(11, 5, 6, 1, 'Evento Laboral', '2023-03-10', '2023-03-20', 'Conferencia laboral', 'Aprobado', '2023-03-11', 'Aprobado', '2023-03-12'),
(12, 7, 8, 1, 'Vacaciones', '2023-03-15', '2023-03-17', 'Solicitud de vacaciones cortas', 'Rechazado', '2023-03-16', 'Rechazado', '2023-03-17'),
(13, 9, 10, 1, 'Enfermedad', '2023-03-20', '2023-03-25', 'Permiso por enfermedad prolongada', 'Aprobado', '2023-03-21', 'Aprobado', '2023-03-22'),
(14, 11, 12, 1, 'Situación familiar', '2023-04-01', '2023-04-10', 'Cuidado de familiar enfermo', 'Pendiente', NULL, 'Pendiente', NULL),
(15, 13, 14, 1, 'Compromiso Personal', '2023-04-05', '2023-04-07', 'Compromiso personal ineludible', 'Aprobado', '2023-04-06', 'Aprobado', '2023-04-07'),
(16, 15, 16, 1, 'Duelo', '2023-04-10', '2023-04-20', 'Fallecimiento de un ser querido', 'Rechazado', '2023-04-11', 'Rechazado', '2023-04-12'),
(17, 17, 18, 1, 'Cita Médico', '2023-04-15', '2023-04-17', 'Cita médica especializada', 'Aprobado', '2023-04-16', 'Aprobado', '2023-04-17'),
(18, 19, 20, 1, 'Trámites Oficiales', '2023-04-20', '2023-04-25', 'Trámites legales urgentes', 'Pendiente', NULL, 'Pendiente', NULL),
(19, 3, 4, 1, 'Emergencia', '2023-05-01', '2023-05-10', 'Emergencia médica familiar', 'Aprobado', '2023-05-02', 'Aprobado', '2023-05-03'),
(20, 5, 6, 1, 'Descanso Mental', '2023-05-05', '2023-05-07', 'Necesidad de descanso por agotamiento', 'Rechazado', '2023-05-06', 'Rechazado', '2023-05-07'),
(21, 7, 8, 1, 'Situación Académica', '2023-05-10', '2023-05-20', 'Entrega de proyecto académico', 'Aprobado', '2023-05-11', 'Aprobado', '2023-05-12'),
(22, 9, 10, 1, 'Evento Laboral', '2023-05-15', '2023-05-17', 'Participación en evento laboral', 'Pendiente', NULL, 'Pendiente', NULL),
(23, 11, 12, 1, 'Vacaciones', '2023-05-20', '2023-05-25', 'Solicitud de vacaciones cortas', 'Aprobado', '2023-05-21', 'Aprobado', '2023-05-22'),
(24, 13, 14, 1, 'Enfermedad', '2023-06-01', '2023-06-10', 'Permiso por enfermedad', 'Rechazado', '2023-06-02', 'Rechazado', '2023-06-03'),
(25, 15, 16, 1, 'Situación familiar', '2023-06-05', '2023-06-07', 'Cuidado de familiar enfermo', 'Aprobado', '2023-06-06', 'Aprobado', '2023-06-07'),
(26, 17, 18, 1, 'Compromiso Personal', '2023-06-10', '2023-06-20', 'Compromiso personal ineludible', 'Pendiente', NULL, 'Pendiente', NULL),
(27, 19, 20, 1, 'Duelo', '2023-06-15', '2023-06-17', 'Fallecimiento de un ser querido', 'Aprobado', '2023-06-16', 'Aprobado', '2023-06-17'),
(28, 3, 4, 1, 'Cita Médico', '2023-06-20', '2023-06-25', 'Cita médica programada', 'Rechazado', '2023-06-21', 'Rechazado', '2023-06-22'),
(29, 5, 6, 1, 'Trámites Oficiales', '2023-07-01', '2023-07-10', 'Renovación de pasaporte', 'Aprobado', '2023-07-02', 'Aprobado', '2023-07-03'),
(30, 7, 8, 1, 'Emergencia', '2023-07-05', '2023-07-07', 'Emergencia familiar', 'Pendiente', NULL, 'Pendiente', NULL),
(31, 9, 10, 1, 'Descanso Mental', '2023-07-10', '2023-07-20', 'Necesidad de descanso por estrés', 'Aprobado', '2023-07-11', 'Aprobado', '2023-07-12'),
(32, 11, 12, 1, 'Situación Académica', '2023-07-15', '2023-07-17', 'Exámenes finales', 'Rechazado', '2023-07-16', 'Rechazado', '2023-07-17'),
(33, 13, 14, 1, 'Evento Laboral', '2023-07-20', '2023-07-25', 'Conferencia laboral', 'Aprobado', '2023-07-21', 'Aprobado', '2023-07-22'),
(34, 15, 16, 1, 'Vacaciones', '2023-08-01', '2023-08-10', 'Solicitud de vacaciones', 'Pendiente', NULL, 'Pendiente', NULL),
(35, 17, 18, 1, 'Enfermedad', '2023-08-05', '2023-08-07', 'Permiso por enfermedad', 'Aprobado', '2023-08-06', 'Aprobado', '2023-08-07'),
(36, 19, 20, 1, 'Situación familiar', '2023-08-10', '2023-08-20', 'Cuidado de familiar enfermo', 'Rechazado', '2023-08-11', 'Rechazado', '2023-08-12'),
(37, 3, 4, 1, 'Compromiso Personal', '2023-08-15', '2023-08-17', 'Compromiso personal ineludible', 'Aprobado', '2023-08-16', 'Aprobado', '2023-08-17'),
(38, 5, 6, 1, 'Duelo', '2023-08-20', '2023-08-25', 'Fallecimiento de un ser querido', 'Pendiente', NULL, 'Pendiente', NULL),
(39, 7, 8, 1, 'Cita Médico', '2023-09-01', '2023-09-10', 'Cita médica especializada', 'Aprobado', '2023-09-02', 'Aprobado', '2023-09-03'),
(40, 9, 10, 1, 'Trámites Oficiales', '2023-09-05', '2023-09-07', 'Trámites legales urgentes', 'Rechazado', '2023-09-06', 'Rechazado', '2023-09-07'),
(41, 11, 12, 1, 'Emergencia', '2023-09-10', '2023-09-20', 'Emergencia médica familiar', 'Aprobado', '2023-09-11', 'Aprobado', '2023-09-12'),
(42, 13, 14, 1, 'Descanso Mental', '2023-09-15', '2023-09-17', 'Necesidad de descanso por agotamiento', 'Pendiente', NULL, 'Pendiente', NULL),
(43, 15, 16, 1, 'Situación Académica', '2023-09-20', '2023-09-25', 'Entrega de proyecto académico', 'Aprobado', '2023-09-21', 'Aprobado', '2023-09-22'),
(44, 17, 18, 1, 'Evento Laboral', '2023-10-01', '2023-10-10', 'Participación en evento laboral', 'Rechazado', '2023-10-02', 'Rechazado', '2023-10-03'),
(45, 19, 20, 1, 'Vacaciones', '2023-10-05', '2023-10-07', 'Solicitud de vacaciones cortas', 'Aprobado', '2023-10-06', 'Aprobado', '2023-10-07'),
(46, 3, 4, 1, 'Enfermedad', '2023-10-10', '2023-10-20', 'Permiso por enfermedad', 'Pendiente', NULL, 'Pendiente', NULL),
(47, 5, 6, 1, 'Situación familiar', '2023-10-15', '2023-10-17', 'Cuidado de familiar enfermo', 'Aprobado', '2023-10-16', 'Aprobado', '2023-10-17'),
(48, 7, 8, 1, 'Compromiso Personal', '2023-10-20', '2023-10-25', 'Compromiso personal ineludible', 'Rechazado', '2023-10-21', 'Rechazado', '2023-10-22'),
(49, 9, 10, 1, 'Duelo', '2023-11-01', '2023-11-10', 'Fallecimiento de un ser querido', 'Aprobado', '2023-11-02', 'Aprobado', '2023-11-03'),
(50, 11, 12, 1, 'Cita Médico', '2023-11-15', '2023-11-17', 'Cita médica programada', 'Pendiente', NULL, 'Pendiente', NULL);



-- Inserción de 50 reuniones con (Superadmin) ESTA BIEN
INSERT INTO Reuniones (idReunion, idUsuario, idUsuario_A, Fecha_reunion, De_que_orgulloso_mes_pasado, Estas_preocupado_decepcionado_estresado, Que_trabajando, Meta_mes, Carga_trabajo, Salud_fisica, Reconocimiento, Salud_emocional, Equilibrio_trabajo_vida) VALUES
(1, 3, 1, '2023-01-05', 'Terminé el módulo X', 'Estresado por plazos', 'Desarrollo de API', 'Terminar el módulo Y', 4, 3, 4, 3, 4),
(2, 5, 1, '2023-01-10', 'Diseñé la interfaz Y', 'Preocupado por feedback', 'Prototipo de interfaz', 'Mejorar el diseño', 3, 4, 3, 4, 3),
(3, 7, 1, '2023-01-15', 'Resolví incidencias críticas', 'Decepcionado por falta de recursos', 'Soporte a clientes', 'Reducir tiempo de respuesta', 5, 2, 3, 2, 3),
(4, 9, 1, '2023-01-20', 'Logré ventas récord', 'Estresado por metas', 'Contactar clientes', 'Aumentar ventas en 10%', 4, 3, 4, 3, 4),
(5, 11, 1, '2023-01-25', 'Lancé la campaña de marketing', 'Preocupado por ROI', 'Diseñar anuncios', 'Mejorar engagement', 3, 4, 3, 4, 3),
(6, 13, 1, '2023-02-01', 'Optimicé procesos', 'Estresado por cambios', 'Automatización de tareas', 'Implementar mejoras', 4, 3, 4, 3, 4),
(7, 15, 1, '2023-02-05', 'Reduje costos', 'Preocupado por presupuesto', 'Análisis financiero', 'Mantener reducción de costos', 3, 4, 3, 4, 3),
(8, 17, 1, '2023-02-10', 'Mejoré la productividad', 'Decepcionado por falta de herramientas', 'Implementación de herramientas', 'Aumentar productividad en 15%', 5, 2, 3, 2, 3),
(9, 19, 1, '2023-02-15', 'Investigué tendencias', 'Estresado por plazos', 'Análisis de mercado', 'Presentar resultados', 4, 3, 4, 3, 4),
(10, 3, 1, '2023-02-20', 'Desarrollé nueva funcionalidad', 'Preocupado por bugs', 'Pruebas de software', 'Lanzar funcionalidad', 3, 4, 3, 4, 3),
(11, 5, 1, '2023-03-01', 'Diseñé logo', 'Estresado por feedback', 'Revisión de diseño', 'Aprobar diseño final', 4, 3, 4, 3, 4),
(12, 7, 1, '2023-03-05', 'Resolví incidencias', 'Decepcionado por falta de soporte', 'Soporte técnico', 'Reducir incidencias', 5, 2, 3, 2, 3),
(13, 9, 1, '2023-03-10', 'Aumenté ventas', 'Estresado por metas', 'Estrategias de ventas', 'Aumentar ventas en 20%', 4, 3, 4, 3, 4),
(14, 11, 1, '2023-03-15', 'Lancé campaña publicitaria', 'Preocupado por resultados', 'Monitoreo de campaña', 'Mejorar ROI', 3, 4, 3, 4, 3),
(15, 13, 1, '2023-03-20', 'Automaticé reportes', 'Estresado por plazos', 'Desarrollo de scripts', 'Implementar automatización', 4, 3, 4, 3, 4),
(16, 15, 1, '2023-03-25', 'Mejoré eficiencia', 'Preocupado por recursos', 'Optimización de procesos', 'Mantener eficiencia', 3, 4, 3, 4, 3),
(17, 17, 1, '2023-04-01', 'Capacité al equipo', 'Decepcionado por participación', 'Sesiones de capacitación', 'Mejorar habilidades del equipo', 5, 2, 3, 2, 3),
(18, 19, 1, '2023-04-05', 'Investigué tendencias', 'Estresado por plazos', 'Análisis de mercado', 'Presentar informe', 4, 3, 4, 3, 4),
(19, 3, 1, '2023-04-10', 'Desarrollé aplicación', 'Preocupado por bugs', 'Pruebas de software', 'Lanzar aplicación', 3, 4, 3, 4, 3),
(20, 5, 1, '2023-04-15', 'Diseñé página web', 'Estresado por feedback', 'Revisión de diseño', 'Aprobar diseño final', 4, 3, 4, 3, 4),
(21, 7, 1, '2023-04-20', 'Resolví incidencias', 'Decepcionado por falta de soporte', 'Soporte técnico', 'Reducir incidencias', 5, 2, 3, 2, 3),
(22, 9, 1, '2023-04-25', 'Aumenté ingresos', 'Estresado por metas', 'Estrategias de ventas', 'Aumentar ingresos en 15%', 4, 3, 4, 3, 4),
(23, 11, 1, '2023-05-01', 'Lancé campaña de email', 'Preocupado por resultados', 'Monitoreo de campaña', 'Mejorar engagement', 3, 4, 3, 4, 3),
(24, 13, 1, '2023-05-05', 'Optimicé base de datos', 'Estresado por plazos', 'Revisión de base de datos', 'Implementar mejoras', 4, 3, 4, 3, 4),
(25, 15, 1, '2023-05-10', 'Mejoré servicio al cliente', 'Preocupado por recursos', 'Implementación de mejoras', 'Mantener calidad de servicio', 3, 4, 3, 4, 3),
(26, 17, 1, '2023-05-15', 'Capacité en liderazgo', 'Decepcionado por participación', 'Sesiones de capacitación', 'Mejorar habilidades de liderazgo', 5, 2, 3, 2, 3),
(27, 19, 1, '2023-05-20', 'Investigué tendencias', 'Estresado por plazos', 'Análisis de mercado', 'Presentar informe', 4, 3, 4, 3, 4),
(28, 3, 1, '2023-05-25', 'Desarrollé funcionalidad', 'Preocupado por bugs', 'Pruebas de software', 'Lanzar funcionalidad', 3, 4, 3, 4, 3),
(29, 5, 1, '2023-06-01', 'Diseñé interfaz móvil', 'Estresado por feedback', 'Revisión de diseño', 'Aprobar diseño final', 4, 3, 4, 3, 4),
(30, 7, 1, '2023-06-05', 'Resolví incidencias', 'Decepcionado por falta de soporte', 'Soporte técnico', 'Reducir incidencias', 5, 2, 3, 2, 3),
(31, 9, 1, '2023-06-10', 'Aumenté ingresos', 'Estresado por metas', 'Estrategias de ventas', 'Aumentar ingresos en 20%', 4, 3, 4, 3, 4),
(32, 11, 1, '2023-06-15', 'Lancé campaña de fidelización', 'Preocupado por resultados', 'Monitoreo de campaña', 'Mejorar retención de clientes', 3, 4, 3, 4, 3),
(33, 13, 1, '2023-06-20', 'Optimicé recursos', 'Estresado por plazos', 'Revisión de recursos', 'Implementar mejoras', 4, 3, 4, 3, 4),
(34, 15, 1, '2023-06-25', 'Mejoré procesos', 'Preocupado por recursos', 'Implementación de mejoras', 'Mantener eficiencia', 3, 4, 3, 4, 3),
(35, 17, 1, '2023-07-01', 'Capacité en tecnología', 'Decepcionado por participación', 'Sesiones de capacitación', 'Mejorar habilidades técnicas', 5, 2, 3, 2, 3),
(36, 19, 1, '2023-07-05', 'Investigué tendencias', 'Estresado por plazos', 'Análisis de mercado', 'Presentar informe', 4, 3, 4, 3, 4),
(37, 3, 1, '2023-07-10', 'Desarrollé aplicación', 'Preocupado por bugs', 'Pruebas de software', 'Lanzar aplicación', 3, 4, 3, 4, 3),
(38, 5, 1, '2023-07-15', 'Diseñé página web', 'Estresado por feedback', 'Revisión de diseño', 'Aprobar diseño final', 4, 3, 4, 3, 4),
(39, 7, 1, '2023-07-20', 'Resolví incidencias', 'Decepcionado por falta de soporte', 'Soporte técnico', 'Reducir incidencias', 5, 2, 3, 2, 3),
(40, 9, 1, '2023-07-25', 'Aumenté ingresos', 'Estresado por metas', 'Estrategias de ventas', 'Aumentar ingresos en 15%', 4, 3, 4, 3, 4),
(41, 11, 1, '2023-08-01', 'Lancé campaña de email', 'Preocupado por resultados', 'Monitoreo de campaña', 'Mejorar engagement', 3, 4, 3, 4, 3),
(42, 13, 1, '2023-08-05', 'Optimicé base de datos', 'Estresado por plazos', 'Revisión de base de datos', 'Implementar mejoras', 4, 3, 4, 3, 4),
(43, 15, 1, '2023-08-10', 'Mejoré servicio al cliente', 'Preocupado por recursos', 'Implementación de mejoras', 'Mantener calidad de servicio', 3, 4, 3, 4, 3),
(44, 17, 1, '2023-08-15', 'Capacité en liderazgo', 'Decepcionado por participación', 'Sesiones de capacitación', 'Mejorar habilidades de liderazgo', 5, 2, 3, 2, 3),
(45, 19, 1, '2023-08-20', 'Investigué tendencias', 'Estresado por plazos', 'Análisis de mercado', 'Presentar informe', 4, 3, 4, 3, 4),
(46, 3, 1, '2023-08-25', 'Desarrollé funcionalidad', 'Preocupado por bugs', 'Pruebas de software', 'Lanzar funcionalidad', 3, 4, 3, 4, 3),
(47, 5, 1, '2023-09-01', 'Diseñé interfaz móvil', 'Estresado por feedback', 'Revisión de diseño', 'Aprobar diseño final', 4, 3, 4, 3, 4),
(48, 7, 1, '2023-09-05', 'Resolví incidencias', 'Decepcionado por falta de soporte', 'Soporte técnico', 'Reducir incidencias', 5, 2, 3, 2, 3),
(49, 9, 1, '2023-09-10', 'Aumenté ingresos', 'Estresado por metas', 'Estrategias de ventas', 'Aumentar ingresos en 20%', 4, 3, 4, 3, 4),
(50, 11, 1, '2023-09-15', 'Lancé campaña de fidelización', 'Preocupado por resultados', 'Monitoreo de campaña', 'Mejorar retención de clientes', 3, 4, 3, 4, 3);

-- Inserción de 50 comentarios(esta bien)
INSERT INTO Comentarios (idComentario, idReunion, Comentario_general, Comentario_RRHH) VALUES
(1, 1, 'Buen trabajo en el módulo X', 'Seguir así'),
(2, 2, 'El diseño de la interfaz Y es excelente', 'Feedback positivo'),
(3, 3, 'Se necesita más personal para soporte', 'Revisar recursos'),
(4, 4, 'Las ventas han mejorado', 'Felicidades'),
(5, 5, 'La campaña de marketing fue un éxito', 'Buen trabajo'),
(6, 6, 'La automatización de tareas está avanzando bien', 'Continuar con el progreso'),
(7, 7, 'La reducción de costos fue efectiva', 'Mantener el enfoque'),
(8, 8, 'La productividad ha mejorado', 'Seguir implementando herramientas'),
(9, 9, 'La investigación de tendencias fue útil', 'Presentar resultados pronto'),
(10, 10, 'La nueva funcionalidad está casi lista', 'Revisar bugs antes del lanzamiento'),
(11, 11, 'El diseño del logo fue aprobado', 'Excelente trabajo'),
(12, 12, 'Las incidencias se están resolviendo', 'Reducir el tiempo de respuesta'),
(13, 13, 'Las ventas han aumentado', 'Mantener la estrategia'),
(14, 14, 'La campaña publicitaria está en marcha', 'Monitorear resultados'),
(15, 15, 'La automatización de reportes fue exitosa', 'Implementar en más áreas'),
(16, 16, 'La eficiencia ha mejorado', 'Seguir optimizando procesos'),
(17, 17, 'La capacitación del equipo fue útil', 'Mejorar la participación'),
(18, 18, 'La investigación de mercado fue productiva', 'Presentar informe pronto'),
(19, 19, 'La aplicación está casi lista', 'Revisar bugs antes del lanzamiento'),
(20, 20, 'El diseño de la página web fue aprobado', 'Excelente trabajo'),
(21, 21, 'Las incidencias se están resolviendo', 'Reducir el tiempo de respuesta'),
(22, 22, 'Los ingresos han aumentado', 'Mantener la estrategia'),
(23, 23, 'La campaña de email está en marcha', 'Monitorear resultados'),
(24, 24, 'La optimización de la base de datos fue exitosa', 'Implementar en más áreas'),
(25, 25, 'El servicio al cliente ha mejorado', 'Seguir optimizando procesos'),
(26, 26, 'La capacitación en liderazgo fue útil', 'Mejorar la participación'),
(27, 27, 'La investigación de tendencias fue productiva', 'Presentar informe pronto'),
(28, 28, 'La nueva funcionalidad está casi lista', 'Revisar bugs antes del lanzamiento'),
(29, 29, 'El diseño de la interfaz móvil fue aprobado', 'Excelente trabajo'),
(30, 30, 'Las incidencias se están resolviendo', 'Reducir el tiempo de respuesta'),
(31, 31, 'Los ingresos han aumentado', 'Mantener la estrategia'),
(32, 32, 'La campaña de fidelización está en marcha', 'Monitorear resultados'),
(33, 33, 'La optimización de recursos fue exitosa', 'Implementar en más áreas'),
(34, 34, 'Los procesos han mejorado', 'Seguir optimizando'),
(35, 35, 'La capacitación en tecnología fue útil', 'Mejorar la participación'),
(36, 36, 'La investigación de mercado fue productiva', 'Presentar informe pronto'),
(37, 37, 'La aplicación está casi lista', 'Revisar bugs antes del lanzamiento'),
(38, 38, 'El diseño de la página web fue aprobado', 'Excelente trabajo'),
(39, 39, 'Las incidencias se están resolviendo', 'Reducir el tiempo de respuesta'),
(40, 40, 'Los ingresos han aumentado', 'Mantener la estrategia'),
(41, 41, 'La campaña de email está en marcha', 'Monitorear resultados'),
(42, 42, 'La optimización de la base de datos fue exitosa', 'Implementar en más áreas'),
(43, 43, 'El servicio al cliente ha mejorado', 'Seguir optimizando procesos'),
(44, 44, 'La capacitación en liderazgo fue útil', 'Mejorar la participación'),
(45, 45, 'La investigación de tendencias fue productiva', 'Presentar informe pronto'),
(46, 46, 'La nueva funcionalidad está casi lista', 'Revisar bugs antes del lanzamiento'),
(47, 47, 'El diseño de la interfaz móvil fue aprobado', 'Excelente trabajo'),
(48, 48, 'Las incidencias se están resolviendo', 'Reducir el tiempo de respuesta'),
(49, 49, 'Los ingresos han aumentado', 'Mantener la estrategia'),
(50, 50, 'La campaña de fidelización está en marcha', 'Monitorear resultados');

-- Inserción de 50 faltas administrativas (esta bien 100%)
INSERT INTO Faltas_administrativas (idFalta, idUsuario, idUsuario_A, Fecha_asignacion_falta, Motivo) VALUES
(1, 3, 1, '2023-01-01', 'Llegada tarde'),
(2, 5, 1, '2023-01-05', 'Falta injustificada'),
(3, 7, 1, '2023-01-10', 'Incumplimiento de tareas'),
(4, 9, 1, '2023-01-15', 'Uso indebido de recursos'),
(5, 11, 1, '2023-01-20', 'Falta de comunicación'),
(6, 13, 1, '2023-01-25', 'Llegada tarde'),
(7, 15, 1, '2023-02-01', 'Falta injustificada'),
(8, 17, 1, '2023-02-05', 'Incumplimiento de tareas'),
(9, 19, 1, '2023-02-10', 'Uso indebido de recursos'),
(10, 3, 1, '2023-02-15', 'Falta de comunicación'),
(11, 5, 1, '2023-02-20', 'Llegada tarde'),
(12, 7, 1, '2023-02-25', 'Falta injustificada'),
(13, 9, 1, '2023-03-01', 'Incumplimiento de tareas'),
(14, 11, 1, '2023-03-05', 'Uso indebido de recursos'),
(15, 13, 1, '2023-03-10', 'Falta de comunicación'),
(16, 15, 1, '2023-03-15', 'Llegada tarde'),
(17, 17, 1, '2023-03-20', 'Falta injustificada'),
(18, 19, 1, '2023-03-25', 'Incumplimiento de tareas'),
(19, 3, 1, '2023-04-01', 'Uso indebido de recursos'),
(20, 5, 1, '2023-04-05', 'Falta de comunicación'),
(21, 7, 1, '2023-04-10', 'Llegada tarde'),
(22, 9, 1, '2023-04-15', 'Falta injustificada'),
(23, 11, 1, '2023-04-20', 'Incumplimiento de tareas'),
(24, 13, 1, '2023-04-25', 'Uso indebido de recursos'),
(25, 15, 1, '2023-05-01', 'Falta de comunicación'),
(26, 17, 1, '2023-05-05', 'Llegada tarde'),
(27, 19, 1, '2023-05-10', 'Falta injustificada'),
(28, 3, 1, '2023-05-15', 'Incumplimiento de tareas'),
(29, 5, 1, '2023-05-20', 'Uso indebido de recursos'),
(30, 7, 1, '2023-05-25', 'Falta de comunicación'),
(31, 9, 1, '2023-06-01', 'Llegada tarde'),
(32, 11, 1, '2023-06-05', 'Falta injustificada'),
(33, 13, 1, '2023-06-10', 'Incumplimiento de tareas'),
(34, 15, 1, '2023-06-15', 'Uso indebido de recursos'),
(35, 17, 1, '2023-06-20', 'Falta de comunicación'),
(36, 19, 1, '2023-06-25', 'Llegada tarde'),
(37, 3, 1, '2023-07-01', 'Falta injustificada'),
(38, 5, 1, '2023-07-05', 'Incumplimiento de tareas'),
(39, 7, 1, '2023-07-10', 'Uso indebido de recursos'),
(40, 9, 1, '2023-07-15', 'Falta de comunicación'),
(41, 11, 1, '2023-07-20', 'Llegada tarde'),
(42, 13, 1, '2023-07-25', 'Falta injustificada'),
(43, 15, 1, '2023-08-01', 'Incumplimiento de tareas'),
(44, 17, 1, '2023-08-05', 'Uso indebido de recursos'),
(45, 19, 1, '2023-08-10', 'Falta de comunicación'),
(46, 3, 1, '2023-08-15', 'Llegada tarde'),
(47, 5, 1, '2023-08-20', 'Falta injustificada'),
(48, 7, 1, '2023-08-25', 'Incumplimiento de tareas'),
(49, 9, 1, '2023-09-01', 'Uso indebido de recursos'),
(50, 11, 1, '2023-09-05', 'Falta de comunicación');

INSERT INTO DiasFeriados (idDiaFeriado, idUsuario_A, Nombre_asueto, Fecha_asueto) VALUES
(1, 1, 'Año Nuevo', '2025-01-01'),
(2, 1, 'Día de la Constitución Mexicana', '2025-02-03'), 
(3, 1, 'Natalicio de Benito Juárez', '2025-03-17'), 
(4, 1, 'Día del Trabajo', '2025-05-01'),
(5, 1, 'Día de la Batalla de Puebla', '2025-05-05'),
(6, 1, 'Día de la Independencia', '2025-09-16'),
(7, 1, 'Día de la Revolución Mexicana', '2025-11-17'), 
(8, 1, 'Navidad', '2025-12-25');