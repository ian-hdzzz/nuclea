const express = require('express');
 const router = express.Router();
 
 // Definir rutas
 router.get('/departament', (req, res) => {
   res.render('pages/departament');
 });
 
 
 module.exports =  router;