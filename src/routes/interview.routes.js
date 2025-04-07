const express = require('express');
const OneToOneController = require('../controllers/oneToOne.controller');
const SearchController = require('../controllers/search.controller');
const isAuth = require('../util/is-auth');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/interview', OneToOneController.getInterview, OneToOneController.searchEmployees, SearchController.renderEmployeeDetails);
router.get('/interview/edit', OneToOneController.getInterviewEdit);
router.post('/interview/:id', OneToOneController.postInterview);
router.post('/interview/closed/:id', OneToOneController.postClosedQuestions);
    

// router.post('/one/submit', OneToOneController.submitOneToOneInterview);

module.exports = router;