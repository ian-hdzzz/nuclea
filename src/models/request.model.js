const db = require('../util/database');

module.exports = class Request {

  constructor(Id, Tipo, Fecha_I, Fecha_F,Descripcion) {
    this.id = Id;
    this.tipo = Tipo;
    this.fecha_i= Fecha_I;
    this.fecha_f= Fecha_F;
    this.descripcion = Descripcion;
}

//Este método servirá para guardar de manera persistente el nuevo objeto. 
save() {
    return db.execute(`INSERT INTO Solicitudes (

  idUsuario, Tipo, Fecha_inicio, Fecha_fin, Descripcion,

  Aprobacion_L, Fecha_aprob_L, Aprobacion_A, Fecha_aprob_A

)

VALUES (

  ?, ?, ?, ?,?,

  'Pendiente', NULL, 'Pendiente', NULL

)`, [this.id,this.tipo,this.fecha_i ,this.fecha_f,this.descripcion]);
}
  // Método para obtener todas las solicitudes
  static fetchDays(idUsuario){
   return db.execute(`SELECT dias_vaciones
    FROM Usuarios
    WHERE idUsuario=?;`,[idUsuario])
  }
  static updateDays(id, dias_restantes){
    return db.execute(`UPDATE Usuarios
    SET  dias_vaciones = ?  -- Cambia el valor según lo que necesites
    WHERE idUsuario = ?; `,[dias_restantes,id])
  }
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
