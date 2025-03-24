const csrf = require('csurf');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

exports.getAuth = (req, res) => {
    res.render('auth/signup', { 
        hideMenu: true, 
        hideContainer: true, 
        csrfToken: req.csrfToken() 
    });
};

exports.postAuth = (req,res)=>{
    Usuario.fetchOne(req.body.email).then(([rows, fieldData]) => {
        if (rows.length > 0) {
            bcrypt.compare(req.body.password, rows[0].Contrasena)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.nombre = rows[0].Nombre;
                        req.session.isLoggedIn = true;
                        res.redirect('/nuclea/dashboard');
                    } else {
                        res.redirect('/nuclea/signup');
                    }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            res.redirect('/nuclea/signup');
        }
    }).catch((error) => {
        console.log(error);
    });
}