const express = require('express');
const OneToOneController = require('../controllers/oneToOne.controller');
const searchController = require('../controllers/search.controller');
const isAuth = require('../util/is-auth')
const router = express.Router();

router.get('/one', OneToOneController.getOneToOne, searchController.renderSearchComponent);
// Ruta para búsqueda AJAX de empleados
router.get('/nuclea/search-employees', OneToOneController.searchEmployees, searchController.renderSearchComponent);


module.exports = router;