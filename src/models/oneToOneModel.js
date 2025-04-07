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

  static async saveOpenQuestionResponses(userId, responses) {
    try {
      // Create or find an interview record
      let entrevistaId;
      const [existingInterview] = await db.execute(
        'SELECT id FROM entrevistas WHERE idUsuario = ? AND Fecha_reunion = CURDATE()',
        [userId]
      );
      
      if (existingInterview && existingInterview.length > 0) {
        entrevistaId = existingInterview[0].id;
      } else {
        // Create a new interview record
        const [newInterview] = await db.execute(
          'INSERT INTO Reuniones (idUsuario, Fecha_reunion) VALUES (?, CURDATE())',
          [userId]
        );
        entrevistaId = newInterview.insertId;
      }
      
      // For each response, save to the respuestas table
      for (const [questionId, respuesta] of Object.entries(responses)) {
        // Check if a response already exists
        const [existingResponse] = await db.execute(
          'SELECT id FROM respuestas WHERE entrevista_id = ? AND idPreguntaAbierta = ?',
          [entrevistaId, questionId]
        );
        
        if (existingResponse && existingResponse.length > 0) {
          // Update existing response
          await db.execute(
            'UPDATE respuestas SET respuesta = ? WHERE id = ?',
            [respuesta, existingResponse[0].id]
          );
        } else {
          // Insert new response
          await db.execute(
            'INSERT INTO respuestas (entrevista_id, idPreguntaAbierta, respuesta) VALUES (?, ?, ?)',
            [entrevistaId, questionId, respuesta]
          );
        }
      }
      
      return { success: true, entrevistaId };
    } catch (error) {
      console.error('Error saving open questions:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async saveClosedQuestionResponses(userId, responses) {
    try {
      // Find the existing interview or create a new one
      let entrevistaId;
      const [existingInterview] = await db.execute(
        'SELECT id FROM entrevistas WHERE idUsuario = ? AND Fecha_reunion = CURDATE()',
        [userId]
      );
      
      if (existingInterview && existingInterview.length > 0) {
        entrevistaId = existingInterview[0].id;
      } else {
        // Create a new interview record
        const [newInterview] = await db.execute(
          'INSERT INTO Reuniones (idUsuario, Fecha_reunion) VALUES (?, CURDATE())',
          [userId]
        );
        entrevistaId = newInterview.insertId;
      }
      
      // Update the appropriate fields in the Reuniones table
      // This assumes your responses use the same field names as in the Reuniones table
      const fields = [];
      const values = [];
      
      for (const [fieldName, value] of Object.entries(responses)) {
        fields.push(`${fieldName} = ?`);
        values.push(value);
      }
      
      values.push(entrevistaId); // Add ID for WHERE clause
      
      // Update the Reuniones record with all closed question values
      await db.execute(
        `UPDATE Reuniones SET ${fields.join(', ')} WHERE idReunion = ?`,
        values
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error saving closed questions:', error);
      return { success: false, error: error.message };
    }
  }
}


module.exports = OneToOneModel;