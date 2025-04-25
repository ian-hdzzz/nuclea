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
                    e.fechaInicio, 
                    e.horaInicio, 
                    e.fechaFin, 
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
                    e.usuarioId = ? AND e.estado = 'active'
                ORDER BY 
                    e.fechaInicio ASC
            `, [usuarioId]);
            return rows;
        } catch (error) {
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
                    e.fechaInicio, 
                    e.horaInicio, 
                    e.fechaFin, 
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
                ORDER BY 
                    e.fechaInicio ASC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Evento;