// isLoggedIn.js (puede ser un archivo de middleware)
function firstTime(req, res, next) {
    console.log(req.session.firstTime)
    if (req.session.firstTime) {
      console.log('no se puede pasar')
      // Si el usuario ya está autenticado, lo redirige a su dashboard
      return res.redirect('/nuclea/signup/temp');  // Cambia esta URL a la que quieras
    }
    next();  // Si no está autenticado, pasa a la siguiente función de ruta
  }
  
  module.exports = firstTime;