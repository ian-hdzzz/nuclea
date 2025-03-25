const db = require('../util/database');

module.exports = class Request {
  // Método para obtener todas las solicitudes
  static fetchAll() {
    return db.execute(`
      SELECT 
        idSolicitud,
        idUsuario,
        Tipo,
        Fecha_inicio,
        Fecha_fin,
        Descripcion,
        Aprobacion_L,
        Fecha_aprob_L,
        Aprobacion_A,
        Fecha_aprob_A
      FROM Solicitudes
    `);
  }
};
