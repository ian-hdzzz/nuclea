// interview routes
const express = require('express');
const router = express.Router();
const oneEmployee = require('../controllers/oneEmployee.controller');
const isAuth = require('../util/is-auth')
const eventosController = require('../controllers/my-events.controller');

router.get('/oneEmployee', isAuth, oneEmployee.getOneEmployee);
router.get('/oneEmployeeHistory', isAuth, oneEmployee.getEmployeeHistory, eventosController.getAll, eventosController.renderCalendario);

module.exports = router;