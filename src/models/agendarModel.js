const pool = require('../util/database');

class AgendarModel {
    static async createOneToOne(selectedUserId, fechaInicio, horaInicio) {
        try {
            // La reunión durará 1 hora por defecto
            const horaFin = new Date(
                new Date(`${fechaInicio} ${horaInicio}`).getTime() + 60 * 60 * 1000
            ).toTimeString().split(' ')[0];

            const query = `
                INSERT INTO eventos 
                (descripcion, fechaInicio, horaInicio, fechaFin, horaFin, tipoId, usuarioId, estado) 
                VALUES 
                ('One-to-One Meeting', ?, ?, ?, ?, 2, ?, 'active')
            `;

            const [result] = await pool.query(query, [
                fechaInicio,
                horaInicio,
                fechaInicio, // La fecha fin es la misma que la fecha inicio ya que es el mismo día
                horaFin,
                selectedUserId
            ]);

            return result;
        } catch (error) {
            console.error('Error creating one-to-one meeting:', error);
            throw error;
        }
    }

    static async checkUserAvailability(userId, fecha, horaInicio) {
        try {
            const query = `
                SELECT * FROM eventos 
                WHERE usuarioId = ? 
                AND fechaInicio = ? 
                AND horaInicio = ?
                AND estado = 'active'
            `;

            const [events] = await pool.query(query, [userId, fecha, horaInicio]);
            return events.length === 0; // Retorna true si el usuario está disponible
        } catch (error) {
            console.error('Error checking user availability:', error);
            throw error;
        }
    }

    static async getUserEmail(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT Correo_electronico FROM Usuarios WHERE idUsuario = ?',
                [userId]
            );
            return rows.length > 0 ? rows[0].Correo_electronico : null;
        } catch (error) {
            console.error('Error getting user email:', error);
            throw error;
        }
    }

    static async getUserContact(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT Correo_electronico, telefono FROM Usuarios WHERE idUsuario = ?',
                [userId]
            );
            return rows.length > 0 ? {
                email: rows[0].Correo_electronico,
                phone: rows[0].telefono
            } : null;
        } catch (error) {
            console.error('Error getting user contact info:', error);
            throw error;
        }
    }
}

module.exports = AgendarModel;