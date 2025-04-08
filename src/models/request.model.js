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
  static Delete(id){
    return db.execute(`DELETE FROM Solicitudes WHERE idSolicitud=?`,[id]);
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
  static fetchPersonal(id) {
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
      WHERE u.idUsuario=?;
    `,[id]);
    
  }

  static requestcollabs(id) {
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
      JOIN Pertenece p ON u.idUsuario = p.idUsuario 
      WHERE p.idDepartamento = (
        SELECT p2.idDepartamento 
        FROM Pertenece p2 
        WHERE p2.idUsuario = ?
      );
    `, [id]);
  }

  static fetchrequestI(id) {
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
      WHERE s.idSolicitud=?;
    `,[id]);
    
  }

};

// Aprobar solicitud según el rol
module.exports.approveSolicitud = async (idSolicitud, rol) => {
  const db = require('../util/database');

  // Aprobar según rol
  if (rol === 2) {
    await db.execute(`
      UPDATE Solicitudes 
      SET Aprobacion_L = 'Aprobado', Fecha_aprob_L = NOW() 
      WHERE idSolicitud = ?`, [idSolicitud]);
  } else if (rol === 1) {
    await db.execute(`
      UPDATE Solicitudes 
      SET Aprobacion_A = 'Aprobado', Fecha_aprob_A = NOW() 
      WHERE idSolicitud = ?`, [idSolicitud]);
  } else {
    return Promise.reject(new Error('No autorizado'));
  }

  // Verificar si ambas aprobaciones están dadas y aún no se ha procesado
  const [solicitud] = await db.execute(`
    SELECT idUsuario, Aprobacion_L, Aprobacion_A, Fecha_inicio, Fecha_fin
    FROM Solicitudes 
    WHERE idSolicitud = ?`, [idSolicitud]);

  const s = solicitud[0];

  if (
    s.Aprobacion_L === 'Aprobado' &&
    s.Aprobacion_A === 'Aprobado' 
  ) {
    const fechaInicio = new Date(s.Fecha_inicio);
    console.log('fechaInicio', fechaInicio)
    const fechaFin = new Date(s.Fecha_fin);
    console.log('fechafinal', fechaFin)

    const diasSolicitados = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    console.log('diasSolicitados', diasSolicitados)
    // Obtener días restantes del usuario
    const [usuario] = await db.execute(`
      SELECT dias_vaciones 
      FROM Usuarios 
      WHERE idUsuario = ?`, [s.idUsuario]);
    const u = usuario[0];
    console.log('dias_vaciones', u.dias_vaciones)

    const diasfinales = u.dias_vaciones - diasSolicitados;
    console.log('diasfinales', diasfinales)
    // Restar días
    await db.execute(`
      UPDATE Usuarios 
      SET dias_vaciones = ? 
      WHERE idUsuario = ?`, [diasfinales, s.idUsuario]);

  }

  return;
};

// Rechazar solicitud según el rol
module.exports.rejectSolicitud = (idSolicitud, rol) => {
  if (rol === 2) {
    return db.execute(`UPDATE Solicitudes SET Aprobacion_L = 'Rechazado', Fecha_aprob_L = NOW(), Aprobacion_A = 'Rechazado', Fecha_aprob_A = NOW() WHERE idSolicitud = ?`, [idSolicitud]);
  } else if (rol === 1) {
    return db.execute(`UPDATE Solicitudes SET Aprobacion_A = 'Rechazado', Fecha_aprob_A = NOW(), Aprobacion_L = 'Rechazado', Fecha_aprob_L = NOW() WHERE idSolicitud = ?`, [idSolicitud]);
  } else {
    return Promise.reject(new Error('No autorizado'));
  }
};

