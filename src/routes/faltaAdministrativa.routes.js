const express = require('express');
const router = express.Router();
const faltasController = require('../controllers/faltas.controller');
const isAuth = require('../util/is-auth');

// Definir rutas

router.get('/', isAuth, faltasController.getFa);
router.post('/', isAuth, faltasController.postAgregarFa);
router.get('/delete/:idFalta', faltasController.getDelete);
router.get('/update/:idFalta',faltasController.getUpdate)
router.post('/update/:idFalta',faltasController.postUpdate)


module.exports = router;