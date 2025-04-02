// routes/authentication.routes.js (actualizar el archivo existente)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/aunthentication.controller');

// Rutas existentes de autenticación local
router.get('/signup', authController.getAuth);
router.post('/signup', authController.postAuth);

// Actualizar la ruta de logout si existe
router.get('/logout', authController.getLogout);    


module.exports = router;