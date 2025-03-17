const express = require('express');
const router = express.Router();
const Auth = require('../controllers/authController')
//SignUp
router.get('/login', Auth.get_login);
router.post('/login', Auth.post_login);
router.get('/logout', Auth.logOut);

module.exports =  router;