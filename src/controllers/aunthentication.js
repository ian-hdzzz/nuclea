const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const { response } = require("express");

exports.getAuth = (req, res) => {
  const failed = req.session.failed || false;
  req.session.failed = false;
  res.render("auth/signup", {
    hideMenu: true,
    hideContainer: true,
    csrfToken: req.csrfToken(),
    failed,
  });
};

exports.postAuth = (req, res) => {
  Usuario.fetchOne(req.body.email)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        bcrypt
          .compare(req.body.password, rows[0].Contrasena)
          .then((doMatch) => {
            if (doMatch) {
              req.session.nombre = rows[0].Nombre;
              req.session.apellidos = rows[0].Apellidos;
              req.session.email = rows[0].Correo_electronico;
              req.session.registration = rows[0].Fecha_inicio_colab;
              req.session.ciudad = rows[0].Ciudad;
              req.session.pais = rows[0].Pais;
              req.session.calle = rows[0].Calle;              
              req.session.isLoggedIn = true;
              Usuario.fetchDeptSession(req.session.email).then(([deps,fd])=>{
                req.session.departamentos=deps[0].Departamentos;
                return req.session.save(err =>{
                  res.redirect("/nuclea/dashboard")
                })
              })
              .catch((error)=>{
                console.log(error);
              })
            } else {
              req.session.failed = true;
              res.redirect("/nuclea/signup");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.redirect("nuclea/signup");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
