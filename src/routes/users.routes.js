const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/user.controller');
const isAuth = require('../util/is-auth')
const canviewAdmin = require('../util/canviewAdmin');

// Definir rutas
router.get('/',isAuth,users_controller.get_users)
router.post('/',isAuth,users_controller.post_users)
router.get('/logout',users_controller.get_logout)
router.get('/delete/:idUsuario',canviewAdmin,users_controller.get_delete);

module.exports =  router;  