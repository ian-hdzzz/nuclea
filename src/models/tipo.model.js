// models/tipo.js
const db = require('../util/database');

const Tipo = {
    findAll: async () => {
        try {
            const [rows] = await db.query(`
                SELECT 
                    tipo_id, 
                    nombre, 
                    color
                FROM 
                    tiposEvento
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Tipo;