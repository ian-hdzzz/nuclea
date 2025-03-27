const express = require('express');
const router = express.Router();
const dashboard_controller = require('../controllers/dashboard.controller');
const isAuth = require('../util/is-auth')

router.get('/dashboard',dashboard_controller.getDashboard);

module.exports =  router;