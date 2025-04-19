const express = require('express');
const router = express.Router();
const faltasController = require('../controllers/faltas.controller');
const isAuth = require('../util/is-auth');

// Definir rutas

router.get('/', isAuth, faltasController.getFa);
router.post('/', isAuth, faltasController.postAgregarFa);
router.delete('/delete/:idFalta', faltasController.delete);
router.get('/update/:idFalta',faltasController.getUpdate)
router.post('/update/:idFalta',faltasController.postUpdate)
router.get('/search', faltasController.searchAO)


module.exports = router;