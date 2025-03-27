//faltas controller
const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');


exports.get_fa = (req, res, next) => {

    Falta.fetchFA().then(([faltas, fD])=>{
        Usuario.fetchAll().then(([rows, fieldData])=>{
            res.render('../views/pages/faltasAdministrativas.hbs', {
                usuariosfa:rows,
                csrfToken: req.csrfToken(),
                faltas: faltas,
                title: 'Administrative offenses',
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error)
    })
};

exports.post_agregar_fa = (request, response, next) => {
    console.log(request.body);
    console.log(request.body.fecha);
    console.log(request.file);
    const falta = new Falta(
        request.body.idUsu, request.body.fecha, request.body.motivo, request.file.filename
    );
    falta.save()
        .then(() => {
            response.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.log(error);
        });
};

