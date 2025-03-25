const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request');

// Ruta GET para mostrar solicitudes
router.get('/request', requestController.getRequests);

module.exports = router;
