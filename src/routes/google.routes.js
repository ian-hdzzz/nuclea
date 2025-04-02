// routes/authentication.routes.js (actualizar el archivo existente)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/aunthentication.controller');


router.get('/auth/google', authController.getGoogleAuth);
router.get('/auth/google/callback', authController.getGoogleCallback);


module.exports = router; 