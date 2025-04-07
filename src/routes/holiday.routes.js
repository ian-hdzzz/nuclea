const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth')
const holidayController = require('../controllers/holiday.controller')
const canviewAdmin = require('../util/canviewAdmin');
 
// Definir rutas
router.get('/',isAuth,holidayController.get_Holiday);
router.post('/',isAuth,holidayController.post_agregar_holiday)
router.get('/delete/:idDiaFeriado',isAuth,holidayController.get_delete);
router.get('/search',isAuth,holidayController.get_search_holiday);
module.exports =  router;