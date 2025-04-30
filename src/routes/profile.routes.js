const express = require("express");
const router = express.Router();
const profile = require("../controllers/profile.controller");
const isAuth = require('../util/is-auth')
const OneToOneController = require('../controllers/oneToOne.controller');
const oneEmployee = require('../controllers/oneEmployee.controller');
// Definir rutas
router.get("/profile",isAuth,profile.getProfile, oneEmployee.getOneEmployee, );
router.get('/employee-graph/:id');
module.exports = router;