const express = require("express");
const router = express.Router();
const profile = require("../controllers/profile.controller");
// Definir rutas
router.get("/profile", profile.get_profile);

module.exports = router;
