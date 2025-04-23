const express = require('express');
const isAuth = require('../util/is-auth');
const dashController = require('../controllers/reports.controller');
const OneToOneController = require('../controllers/oneToOne.controller');
const router = express.Router();

router.get('/reports', isAuth, dashController.getDashboardInfo);
router.get('/all-employees-graph', OneToOneController.getAllEmployeesGraph);
module.exports =  router;