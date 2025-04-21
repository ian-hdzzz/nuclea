const db = require('../util/database');

module.exports = class DiasFeriados {

  constructor(Id, Tipo, Fecha_I, Fecha_F,Descripcion) {
    this.id = Id;
    this.tipo = Tipo;
    this.fecha_i= Fecha_I;
    this.fecha_f= Fecha_F;
    this.descripcion = Descripcion;
}

  // Método para obtener todas las solicitudes
  static fetchAll() {
    return db.execute(`
      SELECT Nombre_asueto, Fecha_asueto
      FROM DiasFeriados;
    `);
    
  }
  static fetchBetween(diaInicio, diaFin){
    return db.execute(`
      SELECT COUNT(*)
      FROM DiasFeriados
      WHERE Fecha_asueto BETWEEN ? AND ?;`,[diaInicio, diaFin]);
  }
};
