const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');

exports.get_fa = (req, res, next) => {
    Falta.fetchFA()
        .then(([faltas, fD]) => {
            Usuario.fetchAll()
                .then(([rows, fieldData]) => {
                    const noFaltas = faltas.length === 0;

                    res.render('../views/pages/faltasAdministrativas.hbs', {
                        usuariosfa: rows,
                        csrfToken: req.csrfToken(),
                        faltas: faltas,
                        noFaltas: noFaltas,
                        title: 'Administrative offenses',
                        iconClass: 'fa-solid fa-triangle-exclamation',
                    });
                })
                .catch((err) => {
                    console.error('Error fetching Users:', err);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch((err) => {
            console.error('Error fetching Administrative offenses:', err);
            res.status(500).send('Internal Server Error');
        });
};

exports.post_agregar_fa = (req, res, next) => {
    console.log(req.body);
    const archivo = req.file ? req.file.filename : null;

    const falta = new Falta(
        req.body.idUsu,
        req.body.fecha,
        req.body.motivo,
        archivo
    );

    falta.save()
        .then(() => {
            res.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.error("Error al asignar falta:", error);
            res.status(500).send('Error registrando falta administrativa');
        });
};

exports.get_delete = (req, res, next) => {
    Falta.deleteA(req.params.idFalta).then(()=>{
        res.redirect('/nuclea/faltasAdministrativas')
    }).catch((error)=>{
        console.log(error)
    })
};