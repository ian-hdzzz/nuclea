const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// Ruta para la verificación del webhook de WhatsApp
router.get('/webhook', whatsappController.verifyWebhook);

// Ruta para recibir notificaciones del webhook de WhatsApp
router.post('/webhook', whatsappController.handleWebhook);

module.exports = router;