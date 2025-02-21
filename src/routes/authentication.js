const express = require('express');
const router = express.Router();

//SignUp
router.get('/signup',(req, res)=>{
  res.render('auth/signup');
});

module.exports =  router;