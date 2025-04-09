const express = require('express');
const router = express.Router();
const faltas_controller = require('../controllers/faltas.controller');
const isAuth = require('../util/is-auth');

// Definir rutas

router.get('/', isAuth, faltas_controller.get_fa);
router.post('/', isAuth, faltas_controller.post_agregar_fa);
router.get('/delete/:idFalta', faltas_controller.get_delete);
router.get('/update/:idFalta',faltas_controller.get_update)
router.post('/update/:idFalta',faltas_controller.post_update)


module.exports = router;