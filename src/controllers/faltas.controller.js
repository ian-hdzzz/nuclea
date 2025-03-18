//faltas controller
const Falta = require('../models/faltas.model');


exports.get_fa = (req, res, next) => {
    res.render('../views/pages/faltasAdministrativas.hbs');
};

exports.post_agregar_fa = (request, response, next) => {
    res.render('./pages/faltasAdministrativas');
    console.log(request.body);
    const personaje = new Falta(request.body.nombre);
    personaje.save()
        .then(() => {
            request.session.info = `Personaje ${personaje.nombre} guardado.`;
            response.redirect('/personajes');
        })
        .catch((error) => {
            console.log(error);
        });
};

