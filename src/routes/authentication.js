const express = require('express');
const router = express.Router();

//SignUp
router.get('/signup',(req, res)=>{
  res.render('auth/signup',{ hideMenu: true, hideContainer: true});
});

module.exports =  router;