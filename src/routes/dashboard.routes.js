const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const isAuth = require('../util/is-auth')
const isfirstTime = require('../util/firstTime')
const isfirstTutorial = require('../util/firstTutorial')

router.get('/dashboard', isAuth, isfirstTime,isfirstTutorial, dashboardController.getDashboard);

module.exports =  router;