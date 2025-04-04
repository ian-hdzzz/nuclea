const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/user.controller');
const isAuth = require('../util/is-auth')
const canviewAdmin = require('../util/canviewAdmin');

// Definir rutas
router.get('/',canviewAdmin,isAuth,users_controller.get_users)
router.post('/',canviewAdmin,isAuth,users_controller.post_users)
router.get('/logout',users_controller.get_logout)
router.get('/delete/:idUsuario',users_controller.get_delete);
router.get('/view/:idUsuario',users_controller.get_view);

module.exports =  router;  