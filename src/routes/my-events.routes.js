const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const eventosController = require('../controllers/my-events.controller');
const router = express.Router();

// API Routes - these need to be before the view routes
router.get('/api/events', isAuth, eventosController.getAll);
router.post('/api/events', isAuth, eventosController.createEvent);
router.post('/api/sync-google', isAuth, eventosController.syncGoogleEvents);

// View Routes
router.get('/my-events', isAuth, eventosController.renderCalendario);

module.exports = router;