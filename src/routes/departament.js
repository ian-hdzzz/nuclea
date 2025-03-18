const express = require('express');
const Departament = require('../models/departament.model');
 const router = express.Router();
 
 // Definir rutas
 router.get('/departament', (req, res) => {
  Departament.fetchAll().then(([rows,fielData])=>{
    res.render('../views/pages/departament.hbs',{datos:rows})
  })
 });
 
 
 module.exports =  router;