const { id } = require("date-fns/locale");
const Questions = require('../models/oneToOneModel');

exports.getProfile = async (req, res, next)=>{

    const idUsuario = req.session.idUsuario;

    const closedResponses = await Questions.getAllClosedResponsesAverage(idUsuario);
    res.render('./pages/profile', {
        nombre: req.session.nombre || [],
        idUsuario: req.session.idUsuario || [],
        apellidos: req.session.apellidos || [],
        email: req.session.email || [],
        registration: req.session.registration || [],
        ciudad: req.session.ciudad || [],
        pais: req.session.pais || [],
        calle: req.session.calle || [],
        departamentos: req.session.departamentos || [],
        title: 'Profile',
        iconClass: 'fa-solid fa-user',
        csrfToken: req.csrfToken(), // Añadiendo el token explícitamente
        closedResponses: closedResponses,
    });
};

