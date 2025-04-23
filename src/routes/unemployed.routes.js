const express = require('express');
const isAuth = require('../util/is-auth');
const unemployedController = require('../controllers/unemployed.controller');

const router = express.Router();

router.get('/unemployed', isAuth, unemployedController.getUnemployedUsers);

module.exports = router;
