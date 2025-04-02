const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Usuario = require("../models/usuario.model");
require("../util/passport.js");

// Mantener la función getAuth existente
exports.getAuth = (req, res) => {
  const failed = req.session.failed || false;
  req.session.failed = false;
  res.render("auth/signup", {
    hideMenu: true,
    hideContainer: true,
    csrfToken: req.csrfToken(),
    failed,
    error: req.flash("error")
  });
};

// Modificar postAuth para usar Passport
exports.postAuth = (req, res, next) => {
  Usuario.fetchOne(req.body.email)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        bcrypt
          .compare(req.body.password, rows[0].Contrasena)
          .then((doMatch) => {
            if (doMatch) {
              req.login(rows[0], (err) => {
                if (err) {
                  console.log(err);
                  req.flash("error", "Error en la autenticación. Inténtalo de nuevo.");
                  return next(err);
                }

                req.session.idUsuario = rows[0].idUsuario;
                req.session.nombre = rows[0].Nombre;
                req.session.apellidos = rows[0].Apellidos;
                req.session.email = rows[0].Correo_electronico;
                req.session.isLoggedIn = true;

                Usuario.getPrivilegios(rows[0].idUsuario)
                  .then(([privilegios]) => {
                    req.session.privilegios = privilegios.map((p) => p);
                    return Usuario.fetchDeptSession(req.session.email);
                  })
                  .then(([deps]) => {
                    req.session.departamentos = deps[0].Departamentos;
                    req.session.save((err) => {
                      res.redirect("/nuclea/dashboard");
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    req.flash("error", "Error al obtener privilegios.");
                    res.redirect("/nuclea/signup");
                  });
              });
            } else {
              req.flash("error", "Contraseña incorrecta.");
              res.redirect("/nuclea/signup");
            }
          })
          .catch((error) => {
            console.log(error);
            req.flash("error", "Ocurrió un error. Inténtalo más tarde.");
            res.redirect("/nuclea/signup");
          });
      } else {
        req.flash("error", "Correo electrónico no registrado.");
        res.redirect("/nuclea/signup");
      }
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Error en la base de datos.");
      res.redirect("/nuclea/signup");
    });
};

//  Google
exports.getGoogleAuth = passport.authenticate('google', { 
  scope: ['profile', 'email'] 
});

// En auth.controller.js, simplifica el callback de Google
exports.getGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    
    if (err) {
      console.error("Error en autenticación Google:", err);
      return next(err);
    }
    
    if (!user) {
      console.log("Autenticación fallida:", info);
      // req.flash('error', 'Authentication failed. Please try again.');
      req.session.failed = true;
      return res.send('<script>window.opener.postMessage({ authSuccess: false }, "*"); window.close();</script>');
    }
    
    // Login exitoso con Passport
    req.login(user.dbUser || user, (err) => {
      if (err) {
        console.error("Error en login:", err);
        // req.flash('error', 'Login error. Please try again.');
        return res.send('<script>window.opener.postMessage({ authSuccess: false }, "*"); window.close();</script>');
      }
      
      // Configura la sesión
      req.session.idUsuario = user.dbUser.idUsuario;
      req.session.nombre = user.dbUser.Nombre;
      req.session.apellidos = user.dbUser.Apellidos;
      req.session.email = user.dbUser.Correo_electronico;
      req.session.isLoggedIn = true;
      
      // Obtén privilegios y departamentos como lo haces en postAuth
      Usuario.getPrivilegios(user.dbUser.idUsuario)
        .then(([privilegios]) => {
          req.session.privilegios = privilegios.map(p => p);
          
          return Usuario.fetchDeptSession(user.dbUser.Correo_electronico);
        })
        .then(([deps]) => {
          req.session.departamentos = deps[0].Departamentos;
          
          return req.session.save(err => {
            if (err) console.error(err);
            res.send('<script>window.opener.postMessage({ authSuccess: true }, "*"); window.close();</script>');
            
          });
        })
        .catch(error => {
          console.error(error);
          res.send('<script>window.opener.postMessage({ authSuccess: false }, "*"); window.close();</script>');
        });
    });
  })(req, res, next);
};
    

// Función para logout que respeta Passport
exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      res.redirect('/nuclea/signup');
    });
  });
};