const isAuth = require('../util/is-auth')
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request');


// Ruta GET para mostrar solicitudes
router.get('/request', isAuth, requestController.getRequests);
router.post('/request',isAuth, requestController.postRequest);
module.exports = router;