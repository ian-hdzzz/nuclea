const express = require('express');
const OneToOneController = require('../controllers/oneToOneController');

const router = express.Router();

router.get('/one', OneToOneController.getOneToOne);
// router.post('/one/submit', OneToOneController.submitOneToOneInterview);

module.exports = router;