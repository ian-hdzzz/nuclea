const express = require('express');
const Dashboard = require('../controllers/dashboardController');
const router = express.Router();

//SignUp
router.get('/dashboard', Dashboard.get_dashboard);

module.exports =  router;