const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/aunthentication.controller')

//SignUp
router.get('/signup',AuthController.getAuth);
router.post('/signup',AuthController.postAuth);

module.exports =  router;