DROP TRIGGER IF EXISTS AsignarFestivosNuevoUsuario;

DELIMITER //
CREATE TRIGGER AsignarFestivosNuevoUsuario
AFTER INSERT ON Usuarios
FOR EACH ROW
BEGIN
    -- Variables para guardar los IDs de los tipos de eventos
    DECLARE tipo_festivo_id INT;
    DECLARE tipo_no_laborable_id INT;
    
    -- Obtener IDs de tipos
    SELECT tipo_id INTO tipo_festivo_id FROM tiposEvento WHERE nombre = 'Holidays';
    SELECT tipo_id INTO tipo_no_laborable_id FROM tiposEvento WHERE nombre = 'Non-working-days';
    
    -- Días no laborales según la ley mexicana
    
    -- 1 de enero (Año Nuevo)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('New Year', 'Non-working day', '01/01/2025', '00:00:00', '01/01/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- Primer lunes de febrero (en conmemoración del 5 de febrero)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Constitution Day', 'Non-working day', '03/02/2025', '00:00:00', '03/02/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- Tercer lunes de marzo (en conmemoración del 21 de marzo)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Benito Juarez Birthday', 'Non-working day', '17/03/2025', '00:00:00', '17/03/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- 1 de mayo (Día del Trabajo)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Labor Day', 'Non-working day', '01/05/2025', '00:00:00', '01/05/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- 16 de septiembre (Día de la Independencia)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Independence Day', 'Non-working day', '16/09/2025', '00:00:00', '16/09/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- Tercer lunes de noviembre (en conmemoración del 20 de noviembre)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Mexican Revolution Day', 'Non-working day', '17/11/2025', '00:00:00', '17/11/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- 25 de diciembre (Navidad)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Christmas', 'Non-working day', '25/12/2025', '00:00:00', '25/12/2025', '23:59:59', TRUE, tipo_no_laborable_id, NEW.id, 'active');
    
    -- Otros días festivos (no necesariamente no laborables)
    
    -- 6 de enero (Día de Reyes)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Three Kings Day', 'Cultural holiday', '06/01/2025', '00:00:00', '06/01/2025', '23:59:59', TRUE, tipo_festivo_id, NEW.id, 'active');
    
    -- 24 de febrero (Día de la Bandera)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Flag Day', 'Cultural holiday', '24/02/2025', '00:00:00', '24/02/2025', '23:59:59', TRUE, tipo_festivo_id, NEW.id, 'active');
    
    -- 10 de mayo (Día de las Madres)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Mother\'s Day', 'Cultural holiday', '10/05/2025', '00:00:00', '10/05/2025', '23:59:59', TRUE, tipo_festivo_id, NEW.id, 'active');
    
    -- 2 de noviembre (Día de Muertos)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Day of the Dead', 'Cultural holiday', '02/11/2025', '00:00:00', '02/11/2025', '23:59:59', TRUE, tipo_festivo_id, NEW.id, 'active');
    
    -- 12 de diciembre (Día de la Virgen de Guadalupe)
    INSERT INTO eventos (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, diaCompleto, tipoId, usuarioId, estado)
    VALUES ('Virgin of Guadalupe Day', 'Cultural holiday', '12/12/2025', '00:00:00', '12/12/2025', '23:59:59', TRUE, tipo_festivo_id, NEW.id, 'active');
END //
DELIMITER ;