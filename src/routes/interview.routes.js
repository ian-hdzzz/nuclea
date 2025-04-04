const express = require('express');
const OneToOneController = require('../controllers/oneToOne.controller');
const isAuth = require('../util/is-auth')
const router = express.Router();

router.get('/interview', OneToOneController.getInterview);
// router.post('/one/submit', OneToOneController.submitOneToOneInterview);

module.exports = router;