const express = require('express');
const isAuth = require('../util/is-auth');
const dashController = require('../controllers/reports.controller');
const router = express.Router();

router.get('/reports', isAuth, dashController.getDashboardInfo);

module.exports =  router;