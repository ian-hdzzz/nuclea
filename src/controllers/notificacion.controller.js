const Notificacion = require("../models/notificacion.model")

exports.getNotificaciones = async (req, res) => {
  try {
    console.log("Solicitud recibida en getNotificaciones")
    console.log("Sesión:", req.session ? "Existe" : "No existe")
    console.log("ID Usuario:", req.session ? req.session.idUsuario : "No disponible")

    const idUsuario = req.session.idUsuario

    if (!idUsuario) {
      console.log("Error: Usuario no autenticado")
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    console.log("Buscando notificaciones para usuario:", idUsuario)
    const [notificaciones] = await Notificacion.fetchByUser(idUsuario)
    console.log("Notificaciones encontradas:", notificaciones.length)

    const [unreadResult] = await Notificacion.fetchUnreadCount(idUsuario)
    const unreadCount = unreadResult[0].count
    console.log("Notificaciones no leídas:", unreadCount)

    res.json({
      notificaciones,
      unreadCount,
    })
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    res.status(500).json({
      error: "Error al obtener notificaciones",
      message: error.message,
      stack: error.stack,
    })
  }
}

exports.marcarComoLeida = async (req, res) => {
  try {
    const { idNotificacion } = req.params
    const idUsuario = req.session.idUsuario

    if (!idUsuario) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    await Notificacion.markAsRead(idNotificacion)
    res.json({ success: true })
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
    res.status(500).json({ error: "Error al marcar notificación como leída" })
  }
}

exports.marcarTodasComoLeidas = async (req, res) => {
  try {
    const idUsuario = req.session.idUsuario

    if (!idUsuario) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    await Notificacion.markAllAsRead(idUsuario)
    res.json({ success: true })
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error)
    res.status(500).json({ error: "Error al marcar todas las notificaciones como leídas" })
  }
}
