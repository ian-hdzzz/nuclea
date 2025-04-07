const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Ruta para búsquedas AJAX
router.get('/search', searchController.processSearch, searchController.renderEmployeeDetails);

// Ruta para renderizar el componente de búsqueda individualmente (opcional)
router.get('/search-component', searchController.processSearch);

module.exports = router;