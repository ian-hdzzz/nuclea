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
                        title: 'Administrative offenses'
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
    if(req.body.modal=="modal1"){
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
    }
    else if (req.body.modal=="modal2"){
        console.log("Modal2");
    }
    
};

exports.get_delete = (req, res, next) => {
    Falta.deleteA(req.params.idFalta).then(()=>{
        res.redirect('/nuclea/faltasAdministrativas')
    }).catch((error)=>{
        console.log(error)
    })
};

exports.get_update = (req, res, next) => {
    Falta.fetchFA()
        .then(([faltas, fD]) => {
            Usuario.fetchAll()
                .then(([rows, fieldData]) => {
                    const noFaltas = faltas.length === 0;

                    res.render('../views/pages/editarFalta.hbs', {
                        usuariosfa: rows,
                        csrfToken: req.csrfToken(),
                        falta: faltas,
                        noFaltas: noFaltas,
                        title: 'Administrative offenses'
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
}

exports.post_update = (req, res, next) => {
    const idFalta = req.params.idFalta;  // Usar el parámetro de la URL
    console.log(idFalta)
    const archivo = req.file ? req.file.filename : req.body.archivoActual;  // Conservar archivo actual si no hay nuevo

    Falta.Update(idFalta, req.body.idUsu, req.body.fecha, req.body.motivo, archivo)
        .then(() => {
            res.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.error("Error al actualizar:", error);
            res.status(500).send("Error actualizando");
        });
};