// models/evento.js
const db = require('../util/database');

const Evento = {
    findByUsuarioId: async (usuarioId) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    e.eventoId, 
                    e.titulo, 
                    e.descripcion, 
                    DATE_FORMAT(e.fechaInicio, '%Y-%m-%d') as fechaInicio,
                    e.horaInicio, 
                    DATE_FORMAT(e.fechaFin, '%Y-%m-%d') as fechaFin,
                    e.horaFin, 
                    e.tipoId, 
                    e.usuarioId, 
                    e.estado,
                    e.diaCompleto,
                    t.nombre as tipoNombre,
                    t.color as tipoColor
                FROM 
                    eventos e
                    LEFT JOIN tiposEvento t ON e.tipoId = t.tipo_id
                WHERE 
                    e.usuarioId = ? 
                    AND e.estado = 'active'
                    AND e.fechaInicio IS NOT NULL
                    AND e.fechaFin IS NOT NULL
                ORDER BY 
                    e.fechaInicio ASC
            `, [usuarioId]);
            
            // Transformar las fechas en el formato correcto
            return rows.map(evento => ({
                ...evento,
                fechaInicio: evento.fechaInicio ? new Date(evento.fechaInicio) : null,
                fechaFin: evento.fechaFin ? new Date(evento.fechaFin) : null
            }));
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            throw error;
        }
    },

    findAll: async () => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    e.eventoId, 
                    e.titulo, 
                    e.descripcion, 
                    DATE_FORMAT(e.fechaInicio, '%Y-%m-%d') as fechaInicio,
                    e.horaInicio, 
                    DATE_FORMAT(e.fechaFin, '%Y-%m-%d') as fechaFin,
                    e.horaFin, 
                    e.tipoId, 
                    e.usuarioId, 
                    e.estado,
                    e.diaCompleto,
                    t.nombre as tipoNombre,
                    t.color as tipoColor
                FROM 
                    eventos e
                    LEFT JOIN tiposEvento t ON e.tipoId = t.tipo_id
                WHERE 
                    e.estado = 'active'
                    AND e.fechaInicio IS NOT NULL
                    AND e.fechaFin IS NOT NULL
                ORDER BY 
                    e.fechaInicio ASC
            `);
            
            // Transformar las fechas en el formato correcto
            return rows.map(evento => ({
                ...evento,
                fechaInicio: evento.fechaInicio ? new Date(evento.fechaInicio) : null,
                fechaFin: evento.fechaFin ? new Date(evento.fechaFin) : null
            }));
        } catch (error) {
            console.error('Error al obtener todos los eventos:', error);
            throw error;
        }
    }
};

module.exports = Evento;