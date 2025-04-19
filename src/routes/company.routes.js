const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth');
const companyController = require('../controllers/company.controller');
const canviewAdmin = require('../util/canviewAdmin');

// Define routes
router.get('/', isAuth, canviewAdmin, companyController.getCompany);
router.post('/', isAuth, canviewAdmin, companyController.postAgregarCompany);
router.delete('/delete/:idEmpresa', isAuth, canviewAdmin, companyController.delete);
router.get('/update/:idEmpresa',companyController.getUpdate)
router.post('/update/:idEmpresa',companyController.postUpdate)
router.get('/search', isAuth, canviewAdmin, companyController.searchCompany);

module.exports = router;