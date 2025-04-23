const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const isAuth = require('../util/is-auth')
const isfirstTime = require('../util/firstTime')

router.get('/dashboard', isAuth, isfirstTime, dashboardController.getDashboard);

module.exports =  router;