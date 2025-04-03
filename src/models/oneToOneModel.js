const db = require('../util/database');

class OneToOneModel {
  static async getEmployeeById(employeeId) {
    const [rows] = await db.execute(
      'SELECT * FROM Usuarios WHERE idUsuario = ?', 
      [employeeId]
    );
    return rows[0];
  }

  static async saveOneToOneInterview(data) {
    const { 
      idUsuario, 
      idUsuarioA, 
      deOrgulloso, 
      preocupaciones, 
      trabajandoEn, 
      metaMes,
      cargaTrabajo,
      saludFisica,
      reconocimiento,
      saludEmocional,
      equilibrioTrabajoVida
    } = data;

    const [result] = await db.execute(
      `INSERT INTO Reuniones (
        idUsuario, 
        idUsuario_A, 
        Fecha_reunion, 
        De_que_orgulloso_mes_pasado, 
        Estas_preocupado_decepcionado_estresado, 
        Que_trabajando, 
        Meta_mes, 
        Carga_trabajo, 
        Salud_fisica, 
        Reconocimiento, 
        Salud_emocional, 
        Equilibrio_trabajo_vida
      ) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idUsuario, 
        idUsuarioA, 
        deOrgulloso, 
        preocupaciones, 
        trabajandoEn, 
        metaMes,
        cargaTrabajo,
        saludFisica,
        reconocimiento,
        saludEmocional,
        equilibrioTrabajoVida
      ]
    );

    return result.insertId;
  }

  static async getAllEmployees() {
    const [rows] = await db.execute(
      'SELECT idUsuario, Nombre, Apellidos, Modalidad FROM Usuarios WHERE Estatus = 1'
    );
    return rows;
  }
}

module.exports = OneToOneModel;