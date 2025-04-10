const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth');
const companyController = require('../controllers/company.controller');
const canviewAdmin = require('../util/canviewAdmin');

// Define routes
router.get('/', isAuth, canviewAdmin, companyController.getCompany);
router.post('/', isAuth, canviewAdmin, companyController.postAgregarCompany);
router.get('/delete/:idEmpresa', isAuth, canviewAdmin, companyController.getDelete);
router.get('/update/:idEmpresa',companyController.getUpdate)
router.post('/update/:idEmpresa',companyController.postUpdate)

module.exports = router;