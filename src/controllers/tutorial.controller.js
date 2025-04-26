const csrf = require("csurf");
const Usuario = require("../models/usuario.model");
const e = require("connect-flash");



exports.getTutorials = (req, res) => {
    res.render('../views/pages/tutorial.hbs', {
        title: 'Tutoriales',
        iconClass: 'fa-solid fa-book',
        csrfToken: req.csrfToken(),
    });
};


exports.getActualizar = (req, res) => {
    const idUser = req.session.idUsuario
    console.log(idUser);
    Usuario.UpdatePrimerTuto(idUser).then(()=>{
        req.session.firsTutorial = 1;
        res.redirect("/nuclea/dashboard");
    }).catch((error)=>{
        console.log(error);
    })
}
        