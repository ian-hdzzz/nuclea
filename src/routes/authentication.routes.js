const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/aunthentication.controller');
const isLoggedIn = require('../util/isLoggedIn');

//SignUp
router.get('/signup', isLoggedIn, AuthController.getAuth);
router.post('/signup',isLoggedIn, AuthController.postAuth);

module.exports =  router;