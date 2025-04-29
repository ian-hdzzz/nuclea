// interview controller
const OneToOneModel = require('../models/oneToOneModel');
const Questions = require('../models/oneToOneModel');
const SearchModel = require('../models/search.model'); 
const { differenceInYears, differenceInMonths, differenceInDays } = require('date-fns');
const Usuario = require('../models/usuario.model');

exports.getOneEmployee = async (req, res) => {
    console.log("ID del usuario:", req.session.idUsuario);
    res.render('pages/oneEmployee', { 
        title: 'One-to-One ', 
        iconClass: 'fa-solid fa-people-arrows',
    });
}