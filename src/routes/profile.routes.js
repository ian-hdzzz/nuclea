const express = require("express");
const router = express.Router();
const profile = require("../controllers/profile.controller");
const isAuth = require('../util/is-auth')
// Definir rutas
router.get("/profile",isAuth,profile.getProfile);

module.exports = router;
