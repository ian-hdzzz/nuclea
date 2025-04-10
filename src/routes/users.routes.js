const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const isAuth = require('../util/is-auth')
const canviewAdmin = require('../util/canviewAdmin');

// Definir rutas
<<<<<<< HEAD
router.get('/',isAuth,users_controller.get_users)
router.post('/',isAuth,users_controller.post_users)
router.get('/logout',users_controller.get_logout)
router.get('/update/:idUsuario',users_controller.get_update);
router.get('/delete/:idUsuario',users_controller.get_delete);
router.get('/view/:idUsuario',users_controller.get_view);
router.post('/update/:idUsuario',users_controller.post_update);
router.get('/search', users_controller.searchUsers);
=======
router.get('/',isAuth,usersController.getUsers)
router.post('/',isAuth,usersController.postUsers)
router.get('/logout',usersController.getLogout)
router.get('/update/:idUsuario',usersController.getUpdate);
router.get('/delete/:idUsuario',usersController.getDelete);
router.get('/view/:idUsuario',usersController.getView);
router.post('/update/:idUsuario',usersController.postUpdate);

>>>>>>> 9fc9bca5afc901f6f38baed58e1dc361d854517d

module.exports =  router;