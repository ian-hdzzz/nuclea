const express = require('express');
const OneToOneController = require('../controllers/oneToOne.controller');
const searchController = require('../controllers/search.controller');
const isAuth = require('../util/is-auth')
const router = express.Router();

router.get('/one', OneToOneController.getOneToOne);
router.get('/interview', OneToOneController.getInterview);
router.post('/interview',OneToOneController.saveInterview);
router.get('/all-interviews', OneToOneController.getAllInterviewHistory);
router.get('/employee-history/:id', OneToOneController.getEmployeeHistory);
router.get('/interview/details/:id', OneToOneController.getInterviewDetails);
router.get('/employee-graph/:id', OneToOneController.getEmployeeGraph);
router.get('/all-employees-graph', OneToOneController.getAllEmployeesGraph);

// router.get('/interview/edit');

module.exports = router;    