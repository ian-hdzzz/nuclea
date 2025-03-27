const express = require('express');
const OneToOneController = require('../controllers/oneToOne.controller');

const router = express.Router();

router.get('/one', OneToOneController.getOneToOne);
// router.post('/one/submit', OneToOneController.submitOneToOneInterview);

module.exports = router;