const Falta = require('../models/faltas.model');
const Usuario = require('../models/usuario.model');

exports.get_fa = (req, res, next) => {
    // Iteramos sobre los privilegios
    let encontrado = false; // Variable para saber si encontramos el privilegio 'addAO'
    console.log('privilegios session', req.session.privilegios)
    let privilegiostot = req.session.privilegios
    console.log(privilegiostot)
    const mensaje = req.session.info || '';
     if (req.session.info) {
         req.session.info = '';
     }
    
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
                                info: mensaje,
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
                req.session.info = `Addministrative offense saved.`;
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
            Falta.fetchFAI(req.params.idFalta)
                .then(([falta, fD]) => {
                    Usuario.fetchAll()
                        .then(([rows, fieldData]) => {
                            const noFaltas = faltas.length === 0;

                            res.render('../views/pages/editarFalta.hbs', {
                                usuariosfa: rows,
                                csrfToken: req.csrfToken(),
                                faltass: faltas,
                                falta: falta[0],
                                noFaltas: noFaltas,
                                title: 'Administrative offenses'
                            });
                            console.log(falta)
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
        }).catch((err) => {
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