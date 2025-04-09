const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();


router.get('/', isAuth, (req, res) => {
  res.redirect('nuclea/signup')
});


module.exports =  router;