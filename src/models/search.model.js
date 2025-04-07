const db = require('../util/database');

class SearchModel {
  constructor() {
    this.db = db;
  }
  async getAllEmployees() {
      const [rows] = await db.execute(
        'SELECT  idUsuario, nombre, apellidos FROM Usuarios WHERE Estatus = 1'
      );
      return rows;
    }

  // En tu modelo search.model.js
async search(searchTerm, table, fields, returnFields) {
    try {
      let query = `SELECT ${returnFields.join(', ')} FROM ${table}`;
      let params = [];
      
      if (searchTerm && searchTerm.trim() !== '') {
        const whereConditions = fields.map(field => `${field} LIKE ?`).join(' OR ');
        query = `${query} WHERE ${whereConditions}`;
        const searchParam = `%${searchTerm}%`;
        params = Array(fields.length).fill(searchParam);
        
        // Añadir ORDER BY para priorizar los que comienzan con el término
        const orderCases = fields.map(field => 
          `CASE WHEN ${field} LIKE ? THEN 1 ELSE 2 END`
        ).join(' + ');
        
        query += ` ORDER BY ${orderCases}`;
        // Añadir parámetros adicionales para el ORDER BY
        params = params.concat(fields.map(field => `${searchTerm}%`));
      }
      
      const [results] = await this.db.execute(query, params);
      return results;
    } catch (error) {
      console.error(`Error en búsqueda en ${table}:`, error);
      throw error;
    }
  }
  
  // Método específico para buscar usuarios (como ejemplo)
  async searchUsers(searchTerm) {
    return this.search(
      searchTerm,
      'Usuarios',
      ['idUsuario', 'nombre', 'apellidos'],
      ['idUsuario', 'nombre', 'apellidos']
    );
  }
  async getEmployeeById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM Usuarios WHERE idUsuario = ?',
      [id]
    );

    return rows[0]; // Retorna el primer resultado (empleado)
  }
  // Function to get default employees (limited to a specified number)
  async getDefaultEmployees(limit = 3) {
  try {
       // This query should be adjusted to match your database structure
       const query = `SELECT idUsuario, nombre, apellidos FROM usuarios LIMIT ?`;
       const [results] = await db.query(query, [limit]);
       console.log('Default employees retrieved:', results); // Add this logging
       return results;
     } catch (error) {
       console.error('Error getting default employees:', error);
       throw error;
  }
};
  
  
}

module.exports = new SearchModel();