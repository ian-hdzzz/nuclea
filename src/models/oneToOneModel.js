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
        `,
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
  
  static async getQuestions(){
    const [openQuestions] = await db.execute(
      'SELECT * FROM preguntas;'
    );
    return openQuestions;
  }

  // Nuevos métodos para manejar entrevistas
  
  // Método para crear una nueva entrevista
  static async saveInterview(data) {
    const { idUsuario, idUsuarioA } = data;

    
    const [result] = await db.execute(
      `INSERT INTO entrevistas (empleadoId, entrevistadorId, fechaEntrevista, completada) 
       VALUES (?, ?, CURRENT_TIMESTAMP(), 0)`,
      [idUsuario, idUsuarioA]
    );
    
    return result.insertId;
  }
  
  // Método para guardar respuestas (tanto abiertas como cerradas)
  static async saveAnswers(entrevistaId, respuestas) {
    const promises = [];
    
    for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
      // Determinar si es respuesta textual o numérica
      if (typeof respuesta === 'string') {
        promises.push(
          db.execute(
            `INSERT INTO respuestas (entrevistaId, preguntaId, textoRespuesta) 
             VALUES (?, ?, ?)`,
            [entrevistaId, preguntaId, respuesta]
          )
        );
      } else {
        promises.push(
          db.execute(
            `INSERT INTO respuestas (entrevistaId, preguntaId, valorRespuesta) 
             VALUES (?, ?, ?)`,
            [entrevistaId, preguntaId, respuesta]
          )
        );
      }
    }
    
    await Promise.all(promises);
    return true;
  }
  
  // Método para marcar una entrevista como completada
  static async completeInterview(entrevistaId) {
    await db.execute(
      'UPDATE entrevistas SET completada = 1 WHERE entrevistaId = ?',
      [entrevistaId]
    );
    return true;
  }
  
  // Método para obtener una entrevista por su ID
  static async getInterviewById(entrevistaId) {
    const [interview] = await db.execute(
      `SELECT e.*, 
          u1.Nombre AS empleadoNombre, u1.Apellidos AS empleadoApellidos,
          u2.Nombre AS entrevistadorNombre, u2.Apellidos AS entrevistadorApellidos
       FROM entrevistas e
       JOIN Usuarios u1 ON e.empleadoId = u1.idUsuario
       JOIN Usuarios u2 ON e.entrevistadorId = u2.idUsuario
       WHERE e.entrevistaId = ?`,
      [entrevistaId]
    );
    
    if (interview.length === 0) {
      return null;
    }
    
    const [answers] = await db.execute(
      `SELECT r.*, p.pregunta, p.tipoPregunta 
       FROM respuestas r
       JOIN preguntas p ON r.preguntaId = p.preguntaId
       WHERE r.entrevistaId = ?`,
      [entrevistaId]
    );
    
    return { interview: interview[0], answers };
  }
  
  // Método para obtener el historial de entrevistas de un empleado
  static async getEmployeeInterviewHistory(employeeId) {
    const [interviews] = await db.execute(
      `SELECT e.*, 
          u.Nombre AS entrevistadorNombre, u.Apellidos AS entrevistadorApellidos
       FROM entrevistas e
       JOIN Usuarios u ON e.entrevistadorId = u.idUsuario
       WHERE e.empleadoId = ? AND e.completada = 1
       ORDER BY e.fechaEntrevista DESC`,
      [employeeId]
    );
    
    return interviews;
  }
}

module.exports = OneToOneModel;