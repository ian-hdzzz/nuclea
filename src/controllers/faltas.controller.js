//faltas controller
const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');


exports.get_fa = (req, res, next) => {
    Usuario.fetchAll().then(([rows, fieldData])=>{
        res.render('../views/pages/faltasAdministrativas.hbs', {
            usuariosfa:rows,
            csrfToken: request.csrfToken(),
        });
    }).catch((error)=>{
        console.log(error);
    });
    
};

exports.post_agregar_fa = (request, response, next) => {
    console.log(request.body);
    console.log(request.body.fecha);
    const falta = new Falta(request.body.idUsu, request.body.fecha, request.body.motivo);
    falta.save()
        .then(() => {
            response.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.log(error);
        });
};

