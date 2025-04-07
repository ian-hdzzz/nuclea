const isAuth = require('../util/is-auth')
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request');

// Ruta GET para mostrar solicitudes
router.get('/request', isAuth,requestController.getRequests);
router.post('/request', isAuth,requestController.postRequest);


router.get('/request/personal', isAuth,requestController.getRequestsPersonal);
router.post('/request/personal', isAuth,requestController.postRequest);

router.get('/request/approval', isAuth, requestController.getRequestsapr);
router.post('/request/:id/approve', isAuth, requestController.approveRequest); 
router.post('/request/:id/reject', isAuth, requestController.rejectRequest);
router.post('/request/:id/edit', isAuth, requestController.editRequest);
module.exports = router;
