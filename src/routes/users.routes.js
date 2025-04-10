const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const isAuth = require('../util/is-auth')
const canviewAdmin = require('../util/canviewAdmin');

// Definir rutas
router.get('/',isAuth,usersController.getUsers)
router.post('/',isAuth,usersController.postUsers)
router.get('/logout',usersController.getLogout)
router.get('/update/:idUsuario',usersController.getUpdate);
router.get('/delete/:idUsuario',usersController.getDelete);
router.get('/view/:idUsuario',usersController.getView);
router.post('/update/:idUsuario',usersController.postUpdate);
router.get('/search',usersController.searchUsers);
module.exports =  router;