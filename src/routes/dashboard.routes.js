const express = require('express');
const router = express.Router();
// test data

const data = [
    { "title": "div_1", "content": "Contenido para el div 1" },
    { "title": "div_2", "content": "Contenido para el div 2" },
    { "title": "div_3", "content": "Contenido para el div 3" },
    { "title": "div_4", "content": "Contenido para el div 4" },
    { "title": "div_5", "content": "Contenido para el div 5" },
    { "title": "div_6", "content": "Contenido para el div 6" }
  ];
//SignUp
router.get('/dashboard',(req, res)=>{
    res.render('./pages/dashboard',{targets: data});

});

module.exports =  router;