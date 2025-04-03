const db = require('../util/database');

class OneToOneModel {
  static async getEmployeeById(employeeId) {
    const [rows] = await db.execute(
      'SELECT * FROM Usuarios WHERE idUsuario = ?', 
      [employeeId]
    );
    return rows[0];
  }

   
}

module.exports = OneToOneModel;

// COMO PUEDO CREAR MI ARHCIVO MODEL PARA QUE EXTRAIGA CADA UNA DE LAS PREGUNTAS DE LA TABLA Y LA RENDERICE EN ESTE COMPONENTE