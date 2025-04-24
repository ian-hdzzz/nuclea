// models/evento.js
const db = require('../util/database');

const Evento = {
    findByUsuarioId: async (usuarioId) => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    eventId, 
                    titulo, 
                    descripcion, 
                    fechaInicio, 
                    horaInicio, 
                    fechaFin, 
                    horaFin, 
                    tipoId, 
                    usuarioId, 
                    estado
                FROM 
                    eventos 
                WHERE 
                    usuarioId = ? AND estado = 'active'
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
                    eventId, 
                    titulo, 
                    descripcion, 
                    fechaInicio, 
                    horaInicio, 
                    fechaFin, 
                    horaFin, 
                    tipoId, 
                    usuarioId, 
                    estado
                FROM 
                    eventos 
                WHERE 
                    estado = 'active'
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Evento;