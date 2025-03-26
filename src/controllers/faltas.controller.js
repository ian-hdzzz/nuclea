//faltas controller
const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');


exports.get_fa = (req, res, next) => {

    Falta.fetchFA().then(([faltas, fD])=>{
        Usuario.fetchAll().then(([rows, fieldData])=>{
            res.render('../views/pages/faltasAdministrativas.hbs', {
                usuariosfa:rows,
                csrfToken: req.csrfToken(),
                faltas: faltas
            });
        }).catch((err)=>{
            console.error('Error fetching Users:', err);
            res.status(500).send('Internal Server Error');
        });
    }).catch((err)=>{
        console.error('Error fetching Administrative ofenses:', err);
        res.status(500).send('Internal Server Error');
    })
};

exports.post_agregar_fa = (request, response, next) => {
    console.log(request.body);
    console.log(request.body.fecha);
    console.log(request.file);

    const archivo = request.file ? request.file.filename : null; // Si hay archivo, usa el filename; si no, usa null

    const falta = new Falta(
        request.body.idUsu,
        request.body.fecha,
        request.body.motivo,
        archivo
    );
    falta.save()
        .then(() => {
            response.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send('Error registrating Administrative offense');
        });
};

