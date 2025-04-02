const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');

exports.get_fa = (req, res, next) => {
    // Iteramos sobre los privilegios
    let encontrado = false; // Variable para saber si encontramos el privilegio 'addAO'
    console.log('privilegios session', req.session.privilegios)
    let privilegiostot = req.session.privilegios
    console.log(privilegiostot)
    
    for (let privilegio of privilegiostot) {
        if (privilegio.Nombre_privilegio == 'addAO') {
            encontrado = true;
            // Si tiene privilegio 'addAO', mostramos todas las faltas administrativas
            Falta.fetchFA()
                .then(([faltas, fD]) => {
                    Usuario.fetchAll()
                        .then(([rows, fieldData]) => {
                            const noFaltas = faltas.length === 0;

                            return res.render('../views/pages/faltasAdministrativas.hbs', {
                                usuariosfa: rows,
                                csrfToken: req.csrfToken(),
                                faltas: faltas,
                                noFaltas: noFaltas,
                                title: 'Administrative offenses',
                                iconClass: 'fa-solid fa-triangle-exclamation',
                                privilegios: req.session.privilegios || [],
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
            return; // Salimos del ciclo una vez que se haya procesado
        }
    }

    // Si no tiene el privilegio 'addAO', mostramos solo sus faltas personales
    Falta.fetchFAPER(req.session.idUsuario)
        .then(([faltas, fD]) => {
            Usuario.fetchAll()
                .then(([rows, fieldData]) => {
                    const noFaltas = faltas.length === 0;

                    return res.render('../views/pages/faltasAdministrativas.hbs', {
                        usuariosfa: rows,
                        csrfToken: req.csrfToken(),
                        faltas: faltas,
                        noFaltas: noFaltas,
                        title: 'Administrative offenses',
                        iconClass: 'fa-solid fa-triangle-exclamation',
                        privilegios: req.session.privilegios || [],
                    });
                })
                .catch((err) => {
                    console.error('Error fetching Users:', err);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch((err) => {
            console.error('Error fetching Personal Administrative Offenses:', err);
            res.status(500).send('Internal Server Error');
        });
};



exports.post_agregar_fa = (req, res, next) => {
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
    Falta.fetchFAI(req.params.idFalta)
        .then(([faltas, fD]) => {
            Usuario.fetchAll()
                .then(([rows, fieldData]) => {
                    const noFaltas = faltas.length === 0;

                    res.render('../views/pages/editarFalta.hbs', {
                        usuariosfa: rows,
                        csrfToken: req.csrfToken(),
                        falta: faltas[0],
                        noFaltas: noFaltas,
                        title: 'Administrative offenses'
                    });
                    console.log(faltas)
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
    const idFalta = req.params.idFalta;
    const idUsuario = req.body.idUsu || null;
    const fecha = req.body.fecha || null;
    const motivo = req.body.motivo || null;
    const archivo = req.file?.filename ?? req.body.archivoActual ?? null;

    console.log("Valores enviados a Update:", { idFalta, idUsuario, fecha, motivo, archivo });

    Falta.Update(idFalta, idUsuario, fecha, motivo, archivo)
        .then(() => {
            res.redirect('/nuclea/faltasAdministrativas');
        })
        .catch((error) => {
            console.error("Error al actualizar:", error);
            res.status(500).send("Error actualizando");
        });
};