const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth')
const holidayController = require('../controllers/holiday.controller')
const canviewAdmin = require('../util/canviewAdmin');
 
// Definir rutas
router.get('/',isAuth,holidayController.getHoliday);
router.post('/',isAuth,holidayController.postAgregarHoliday)
router.delete('/delete/:idDiaFeriado',isAuth,holidayController.deleteDelete);
router.get('/update/:idDiaFeriado',holidayController.getUpdate)
router.post('/update/:idDiaFeriado',holidayController.postUpdate)
router.get('/search',isAuth,holidayController.getSearchHoliday);

module.exports =  router;