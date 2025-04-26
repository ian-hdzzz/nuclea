// middlewares/firstTutorial.js
function firstTutorial(req, res, next) {
    // Asegurarnos de que estamos usando el mismo nombre de propiedad
    const ft = Number(req.session.firsTutorial) || 0;
    console.log('firstTutorial en sesión:', ft);
  
    if (ft === 0) {
      console.log('Usuario NO completó el tutorial → redirigiendo...');
      return res.redirect('/nuclea/tutorial');
    }
  
    console.log('Usuario ya completó el tutorial → sigue adelante');
    return next();
  }
  
  module.exports = firstTutorial;