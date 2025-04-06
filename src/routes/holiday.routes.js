const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth')
const holidayController = require('../controllers/holiday.controller')
const canviewAdmin = require('../util/canviewAdmin');
 
// Definir rutas
router.get('/', holidayController.get_Holiday);
router.post('/', holidayController.post_agregar_holiday)
//router.delete('/delete/:idDepartamento',departamentController.get_delete);
//router.get('/update/:idDepartamento',departamentController.get_update)
//router.post('/update/:idDepartamento',departamentController.post_update)
router.get('/search', holidayController.get_search_holiday);
module.exports =  router;