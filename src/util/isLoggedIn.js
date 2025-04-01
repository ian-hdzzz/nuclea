// isLoggedIn.js (puede ser un archivo de middleware)
function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
      // Si el usuario ya está autenticado, lo redirige a su dashboard
      return res.redirect('/nuclea/admin');  // Cambia esta URL a la que quieras
    }
    next();  // Si no está autenticado, pasa a la siguiente función de ruta
  }
  
  module.exports = isLoggedIn;