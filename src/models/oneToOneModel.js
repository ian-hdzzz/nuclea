// interview model
const db = require('../util/database');

class OneToOneModel {
  static async getEmployeeById(employeeId) {
    const [rows] = await db.execute(
      `
          SELECT
            u.*,
            GROUP_CONCAT(d.Nombre_Departamento SEPARATOR ', ') AS \`Departamentos\`
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
  static async getDepartmentById(departmentId) {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM Departamentos
      WHERE idDepartamento = ?
      `,
      [departmentId]
    );
  
    return rows[0]; // devuelve solo uno
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
    const { idUsuario, idUsuarioA, comentariosAdmin, comentariosColaborador } = data;
  
    const [result] = await db.execute(
      `INSERT INTO entrevistas (
        empleadoId, 
        entrevistadorId, 
        fechaEntrevista, 
        completada,
        comentariosAdmin,
        comentariosColaborador
      ) VALUES (?, ?, CURRENT_TIMESTAMP(), 0, ?, ?)`,
      [idUsuario, idUsuarioA, comentariosAdmin || null, comentariosColaborador || null]
    );
    
    return result.insertId;
  }
  
  // New method to update comments in an existing interview
  static async updateInterviewComments(entrevistaId, comentariosAdmin, comentariosColaborador) {
    try {
      await db.execute(
        `UPDATE entrevistas 
         SET comentariosAdmin = ?, comentariosColaborador = ?
         WHERE entrevistaId = ?`,
        [comentariosAdmin || null, comentariosColaborador || null, entrevistaId]
      );
      return true;
    } catch (error) {
      console.error('Error updating interview comments:', error);
      throw error;
    }
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
  

  static async getAllCompletedInterviewHistory() {
    try {
      const [interviews] = await db.execute(
        `SELECT e.*,
         u.Nombre AS entrevistadorNombre,
         u.Apellidos AS entrevistadorApellidos,
         emp.Nombre AS empleadoNombre,
         emp.Apellidos AS empleadoApellidos
         FROM entrevistas e
         JOIN Usuarios u ON e.entrevistadorId = u.idUsuario
         JOIN Usuarios emp ON e.empleadoId = emp.idUsuario
         WHERE e.completada = 1
         ORDER BY e.fechaEntrevista DESC`
      );
      return interviews;
    } catch (error) {
      console.error('Error fetching completed interviews:', error);
      throw error;
    }
  }
  static async getSpecificInterviewHistory(employeeId) {
    try {
      const [rows] = await db.execute(
        `SELECT e.*,
                u.Nombre AS entrevistadorNombre,
                u.Apellidos AS entrevistadorApellidos
         FROM entrevistas e
         JOIN Usuarios u ON e.entrevistadorId = u.idUsuario
         WHERE e.empleadoId = ?
           AND e.completada = 1
         ORDER BY e.fechaEntrevista DESC`,
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching interview history by employee:', error);
      throw error;
    }
  }

  static async getInterviewById(interviewId) {
    try {
      // Log the interviewId to troubleshoot
      console.log("Fetching interview with ID:", interviewId);
      
      if (!interviewId || interviewId === 'undefined') {
          throw new Error('Invalid interview ID provided');
      }
      
      // Adjust table names based on your actual schema
      // Replace 'users' with your actual users table name
      const query = `
          SELECT e.*, 
                 u1.Nombre AS empleadoNombre, 
                 u1.Apellidos AS empleadoApellidos,
                 u2.Nombre AS entrevistadorNombre, 
                 u2.Apellidos AS entrevistadorApellidos
          FROM entrevistas e
          INNER JOIN Usuarios u1 ON e.empleadoId = u1.idUsuario
          INNER JOIN Usuarios u2 ON e.entrevistadorId = u2.idUsuario
          WHERE e.entrevistaId = ?
      `;
      
      const [rows] = await db.query(query, [interviewId]);
      return rows.length > 0 ? rows[0] : null;
  } catch (error) {
      console.error('Error al obtener entrevista por ID:', error);
      throw error;
  }
};

static async getOpenResponses(interviewId) {
  try {
      const query = `
          SELECT r.respuestaId AS respuestaId, 
                 r.textoRespuesta, 
                 p.preguntaId AS preguntaId, 
                 p.pregunta, 
                 p.descripcionPregunta
          FROM respuestas r
          INNER JOIN preguntas p ON r.preguntaId = p.preguntaId
          WHERE r.entrevistaId = ? AND p.tipoPregunta = 'abierta'
          ORDER BY p.preguntaId
      `;
      
      const [rows] = await db.query(query, [interviewId]);
      return rows;
  } catch (error) {
      console.error('Error al obtener respuestas abiertas:', error);
      throw error;
  }
};

static async getClosedResponses(interviewId){
  try {
      const query = `
          SELECT r.respuestaId AS respuestaId, 
                 r.valorRespuesta, 
                 p.preguntaId AS preguntaId, 
                 p.pregunta, 
                 p.descripcionPregunta
          FROM respuestas r
          INNER JOIN preguntas p ON r.preguntaId = p.preguntaId
          WHERE r.entrevistaId = ? AND p.tipoPregunta = 'cerrada'
          ORDER BY p.preguntaId
      `;
      
      const [rows] = await db.query(query, [interviewId]);
      return rows;
  } catch (error) {
      console.error('Error al obtener respuestas cerradas:', error);
      throw error;
  }
};
// En oneToOneModel.js
static async getAllClosedResponsesAverage(){
  try {
      // Esta consulta debe agrupar todas las respuestas por pregunta y calcular el promedio
      const query = `
          SELECT 
              p.preguntaId,
              p.pregunta,
              p.orden,
              AVG(r.valorRespuesta) as valorRespuesta
          FROM preguntas p
          JOIN respuestas r ON p.preguntaId = r.preguntaId
          JOIN entrevistas e ON r.entrevistaId = e.entrevistaId
          WHERE p.tipoPregunta = 'cerrada' AND e.completada = 1
          GROUP BY p.preguntaId
          ORDER BY p.orden ASC
      `;
      const [rows, fields] = await db.query(query);
      console.log('Promedios de respuestas cerradas:', rows);
      return rows;
  } catch (error) {
      console.error('Error al obtener promedios de respuestas cerradas:', error);
      throw error;
  }
};

static async getEmployeeClosedResponsesAverage(employeeId){
  try {
      // Esta consulta debe agrupar las respuestas del empleado por pregunta y calcular el promedio
      const query = `
          SELECT 
              p.preguntaId,
              p.pregunta,
              p.orden,
              AVG(r.valorRespuesta) as valorRespuesta
          FROM preguntas p
          JOIN respuestas r ON p.preguntaId = r.preguntaId
          JOIN entrevistas e ON r.entrevistaId = e.entrevistaId
          WHERE p.tipoPregunta = 'cerrada' AND e.completada = 1 AND e.empleadoId = ?
          GROUP BY p.preguntaId
          ORDER BY p.orden ASC
      `;
      
      return await db.query(query, [employeeId]);
  } catch (error) {
      console.error(`Error al obtener promedios de respuestas cerradas para el empleado ${employeeId}:`, error);
      throw error;
  }
};
// QUESTIONS CRUD 
static async createQuestion(data) {
  try {
      const { pregunta, descripcionPregunta, tipoPregunta, orden } = data;
      const [[{ maxOrden }]] = await db.execute(
        'SELECT MAX(orden) AS maxOrden FROM preguntas'
      );
      const nuevoOrden = (maxOrden ?? 0) + 1;
      // Default values for min/max scale if it's a closed question
      const escalaMinima = tipoPregunta === 'cerrada' ? 1 : null;
      const escalaMaxima = tipoPregunta === 'cerrada' ? 5 : null;
      
      const [result] = await db.execute(
          `INSERT INTO preguntas (
              pregunta, 
              descripcionPregunta, 
              tipoPregunta, 
              orden,
              escalaMinima,
              escalaMaxima,
              activa
          ) VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [pregunta, descripcionPregunta, tipoPregunta, nuevoOrden, escalaMinima, escalaMaxima]
      );
      
      return result.insertId;
  } catch (error) {
      console.error('Error creating question:', error);
      throw error;
  }
}

// Update an existing question
static async updateQuestion(questionId, data) {
  try {
      const { pregunta, descripcionPregunta, tipoPregunta, orden } = data;
      
      // Build SET clause dynamically based on provided data
      const updates = [];
      const params = [];
      
      if (pregunta !== undefined) {
          updates.push('pregunta = ?');
          params.push(pregunta);
      }
      
      if (descripcionPregunta !== undefined) {
          updates.push('descripcionPregunta = ?');
          params.push(descripcionPregunta);
      }
      
      if (tipoPregunta !== undefined) {
          updates.push('tipoPregunta = ?');
          params.push(tipoPregunta);
      }
      
      if (orden !== undefined) {
          updates.push('orden = ?');
          params.push(orden);
      }
      
      // Update fechaModificacion
      updates.push('fechaModificacion = CURRENT_TIMESTAMP()');
      
      // Add questionId to params
      params.push(questionId);
      
      const query = `
          UPDATE preguntas
          SET ${updates.join(', ')}
          WHERE preguntaId = ?
      `;
      
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
  } catch (error) {
      console.error('Error updating question:', error);
      throw error;
  }
}


// Delete a question (soft delete by setting active=0)
static async deleteQuestion(questionId) {
  try {
      const [result] = await db.execute(
          'DELETE FROM preguntas WHERE preguntaId = ?',
          [questionId]
      );
      return result.affectedRows > 0;
  } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
  }
}
}

module.exports = OneToOneModel;