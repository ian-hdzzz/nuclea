const express = require('express');
const router = express.Router();
const faltas_controller = require('../controllers/faltas.controller');

// Definir rutas
router.get('/',faltas_controller.get_fa)
router.post('/',faltas_controller.post_agregar_fa)


module.exports =  router;  