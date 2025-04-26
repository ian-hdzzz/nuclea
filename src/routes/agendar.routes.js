const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth');
const agendarController = require('../controllers/agendar.controller');

router.post('/agendar-one-to-one', isAuth, agendarController.scheduleOneToOne);

module.exports = router;