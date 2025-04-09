const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth');
const companyController = require('../controllers/company.controller');
const canviewAdmin = require('../util/canviewAdmin');

// Define routes
router.get('/', isAuth, canviewAdmin, companyController.get_company);
router.post('/', isAuth, canviewAdmin, companyController.post_agregar_company);
router.get('/delete/:idEmpresa', isAuth, canviewAdmin, companyController.get_delete);
router.get('/update/:idEmpresa',companyController.get_update)
router.post('/update/:idEmpresa',companyController.post_update)

module.exports = router;