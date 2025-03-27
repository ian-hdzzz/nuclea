const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request');

// Ruta GET para mostrar solicitudes
router.get('/request', requestController.getRequests);
router.post('/request', requestController.postRequest);
module.exports = router;