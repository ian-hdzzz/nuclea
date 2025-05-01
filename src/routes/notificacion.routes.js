const express = require("express")
const router = express.Router()
const notificacionController = require("../controllers/notificacion.controller")
const isAuth = require("../util/is-auth")



router.get("/api/notificaciones", isAuth, notificacionController.getNotificaciones)
router.put("/api/notificaciones/:idNotificacion/leida", isAuth, notificacionController.marcarComoLeida)
router.put("/api/notificaciones/leer-todas", isAuth, notificacionController.marcarTodasComoLeidas);

module.exports = router
