//faltas controller
const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');


exports.get_fa = (req, res, next) => {
    Usuario.fetchAll().then(([rows, fieldData])=>{
        res.render('../views/pages/faltasAdministrativas.hbs', {usuariosfa:rows}
        );
    }).catch((error)=>{
        console.log(error);
    });
    
};

exports.post_agregar_fa = (request, response, next) => {
    console.log(request.body);
    const personaje = new Falta(request.body.nombre);
    personaje.save()
        .then(() => {
            request.session.info = `Personaje ${personaje.nombre} guardado.`;
            response.redirect('../views/pages/faltasAdministrativas.hbs');
        })
        .catch((error) => {
            console.log(error);
        });
};

