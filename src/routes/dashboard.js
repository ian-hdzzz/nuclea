const express = require('express');
const router = express.Router();

//SignUp
router.get('/dashboard',(req, res)=>{
    res.render('./pages/dashboard');

});

module.exports =  router;