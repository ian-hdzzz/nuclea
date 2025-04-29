// interview routes
const express = require('express');
const router = express.Router();
const oneEmployee = require('../controllers/oneEmployee.controller');
const searchController = require('../controllers/search.controller');
const isAuth = require('../util/is-auth')

router.get('/oneEmployee', isAuth, oneEmployee.getOneEmployee);

module.exports = router;