const Usuario = require('../models/authModel');

class Auth {
  get_login(request, response, next) {
    response.render('auth/login', {
      hideMenu: true, 
      hideContainer: true,
      email: request.session.email || '',
      isNew: false,
    });
  }

  async post_login(request, response, next) {
    try {
      const email = request.body.email;
      const password = request.body.password;
      
    
      const users = await Usuario.fetchOne(email);
      
      // Check if users is empty or doesn't have expected structure
      if (!users || users.length === 0) {
        return response.render('auth/login', {
          hideMenu: true,
          hideContainer: true,
          email: email,
          error: 'Email o contraseña incorrectos',
          isNew: false
        });
      }
      
      const user = users[0];
      
      // Comparación directa de contraseñas
      if (password === user.contrasena) {
        // Contraseña correcta - iniciar sesión
        request.session.isLoggedIn = true;
        request.session.email = user.email;
        request.session.userId = user.id;
        
        // Guardar la sesión y redirigir
        return request.session.save(err => {
          if (err) console.log(err);
          return response.redirect('dashboard');
        });
      } else {
        // Contraseña incorrecta
        return response.render('auth/login', {
          hideMenu: true,
          hideContainer: true,
          email: email,
          error: 'Email o contraseña incorrectos',
          isNew: false
        });
      }
    } catch (error) {
      console.error('Error en post_login:', error);
      return response.status(500).render('auth/error', {
        hideMenu: true,
        hideContainer: true,
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error al procesar tu solicitud'
      });
    }
  }

  isAuthenticated(req, res, next) {
    console.log("Sesión actual:", req.session);
    
    // Verifica si la sesión tiene la marca isLoggedIn
    if (req.session && req.session.isLoggedIn) {
      console.log("Usuario autenticado:", req.session.email);
      return next(); // Si está logueado, permite continuar
    }
    
    // Si no está logueado, redirige al login
    console.log("Usuario no autenticado, redirigiendo a login");
    res.redirect('login');
  }

  logOut(req, res) {
    // Elimina la sesión cuando se haga logout
    req.session.destroy(() => {
      res.redirect('login'); // Redirige al usuario después de cerrar sesión
    });
  }
}

module.exports = new Auth();