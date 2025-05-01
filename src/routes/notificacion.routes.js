const express = require("express")
const router = express.Router()
const notificacionController = require("../controllers/notificacion.controller")
const isAuth = require("../util/is-auth")

// Ruta de prueba sin autenticación
router.get("/api/test-notificaciones", (req, res) => {
  res.json({
    success: true,
    message: "API de notificaciones funcionando correctamente",
    session: req.session
      ? {
          idUsuario: req.session.idUsuario,
          authenticated: !!req.session.idUsuario,
        }
      : "No hay sesión",
  })
})

router.get("/api/notificaciones", isAuth, notificacionController.getNotificaciones)
router.put("/api/notificaciones/:idNotificacion/leida", isAuth, notificacionController.marcarComoLeida)
router.put("/api/notificaciones/leer-todas", isAuth, notificacionController.marcarTodasComoLeidas);

module.exports = router
