const pool = require('../util/database');

class AgendarModel {
    static async createOneToOne(selectedUserId, fechaInicio, horaInicio, titulo = "One-to-one") {
        try {
            // Convertir la hora de inicio a objeto Date
            const startDateTime = new Date(`${fechaInicio}T${horaInicio}`);
            // Agregar una hora
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
            // Obtener la hora final en formato HH:mm
            const horaFin = endDateTime.toTimeString().slice(0, 5);

            const query = `
                INSERT INTO eventos 
                (titulo, descripcion, fechaInicio, horaInicio, fechaFin, horaFin, tipoId, usuarioId, estado) 
                VALUES 
                (?, 'One-to-One Meeting', ?, ?, ?, ?, 2, ?, 'active')
            `;

            const [result] = await pool.query(query, [
                titulo,
                fechaInicio,
                horaInicio,
                fechaInicio,
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