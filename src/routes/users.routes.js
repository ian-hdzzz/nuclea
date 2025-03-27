const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/user.controller');
const isAuth = require('../util/is-auth')

// Definir rutas
router.get('/',isAuth,users_controller.get_users)
router.post('/',isAuth,users_controller.post_users)


module.exports =  router;  