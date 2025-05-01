const db = require("../util/database")

module.exports = class Notificacion {
  constructor(idUsuario, mensaje, tipo, idRelacionado, leido = 0, fecha_creacion = new Date()) {
    this.idUsuario = idUsuario
    this.mensaje = mensaje
    this.tipo = tipo // 'solicitud', 'aprobacion', 'rechazo', etc.
    this.idRelacionado = idRelacionado // ID de la solicitud relacionada
    this.leido = leido
    this.fecha_creacion = fecha_creacion
  }

  save() {
    return db.execute(
      "INSERT INTO Notificaciones (idUsuario, mensaje, tipo, idRelacionado, leido, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)",
      [this.idUsuario, this.mensaje, this.tipo, this.idRelacionado, this.leido, this.fecha_creacion],
    )
  }

  static fetchByUser(idUsuario, limit = 10) {
    return db.execute("SELECT * FROM Notificaciones WHERE idUsuario = ? ORDER BY fecha_creacion DESC LIMIT ?", [
      idUsuario,
      limit,
    ])
  }

  static fetchUnreadCount(idUsuario) {
    return db.execute("SELECT COUNT(*) as count FROM Notificaciones WHERE idUsuario = ? AND leido = 0", [idUsuario])
  }

  static markAsRead(idNotificacion) {
    return db.execute("UPDATE Notificaciones SET leido = 1 WHERE idNotificacion = ?", [idNotificacion])
  }

  static markAllAsRead(idUsuario) {
    return db.execute("UPDATE Notificaciones SET leido = 1 WHERE idUsuario = ? AND leido = 0", [idUsuario])
  }
}
