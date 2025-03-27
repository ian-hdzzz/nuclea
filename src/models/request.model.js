const db = require('../util/database');

module.exports = class Request {
  // Método para obtener todas las solicitudes
  static fetchAll() {
    return db.execute(`
      SELECT 
        s.idSolicitud,
        u.Nombre,
        u.Apellidos AS Apellido,
        s.Tipo,
        s.Fecha_inicio,
        s.Fecha_fin,
        s.Descripcion,
        s.Aprobacion_L,
        s.Fecha_aprob_L,
        s.Aprobacion_A,
        s.Fecha_aprob_A
      FROM Solicitudes s
      JOIN Usuarios u ON s.idUsuario = u.idUsuario
    `);
    
  }
};
