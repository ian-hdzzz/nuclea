const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/user.controller');

// Definir rutas
router.get('/',users_controller.get_users)
router.post('/',users_controller.post_users)


module.exports =  router;  