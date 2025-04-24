const express = require('express');
const router = express.Router();
const tutorialController = require('../controllers/tutorial.controller');
const isAuth = require('../util/is-auth');

// Definir rutas

router.get('/', isAuth, tutorialController.getTutorials); 
router.get('/actualizar', isAuth, tutorialController.getActualizar);


module.exports = router;