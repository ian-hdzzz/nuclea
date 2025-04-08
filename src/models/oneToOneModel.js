const db = require('../util/database');

class OneToOneModel {
  static async getEmployeeById(employeeId) {
    const [rows] = await db.execute(
      `
          SELECT
            u.*,
            GROUP_CONCAT(d.Nombre_departamento SEPARATOR ', ') AS Departamentos
          FROM Usuarios u
          LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
          LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
          WHERE u.idUsuario = ?
          GROUP BY u.idUsuario;
        `
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
  static async getOpenQuestions(){
    const [openQuestions] = await db.execute(
      'SELECT * FROM preguntas_abiertas WHERE es_default = 1'
    );
    return openQuestions;
  }
  static async getOptionQuestions(){
    const [optionQuestions] = await db.execute(
      'SELECT * FROM preguntas_cerradas WHERE es_default = 1'
    );
    return optionQuestions;
  }

  
  
}


module.exports = OneToOneModel;