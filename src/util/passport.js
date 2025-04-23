// config/passport.js
const passport = require('passport');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require("../models/usuario.model");


require('dotenv').config();
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Disponible' : 'No disponible');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Disponible' : 'No disponible');

// Estrategia local
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    Usuario.fetchOne(email)
      .then(([users]) => {
        if (users.length === 0) {
          return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }

        const user = users[0];
        bcrypt.compare(password, user.Contrasena)
          .then(doMatch => {
            if (doMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Usuario o contraseña incorrectos' });
            }
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }
));

// Estrategia de Google
let callbackURL;
if (process.env.NODE_ENV === 'production') {
  // URL absoluta para producción
  callbackURL = "https://tec3.nuclea.solutions/auth/google/callback";
} else if (process.env.NODE_ENV === 'development') {
  // URL para desarrollo
  callbackURL = "http://localhost:4002/auth/google/callback";
} else{
  callbackURL = "https://nuclea-production.up.railway.app/auth/google/callback";
}
passport.use(new GoogleStrategy({
  
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("Google profile:", JSON.stringify(profile));
    console.log("Access token:", accessToken);

    // Obtener el correo electrónico del perfil de Google
    if (!profile.emails || profile.emails.length === 0) {
        console.error("Email es undefined, no se puede buscar en la BD");
        return done(null, false, { message: "Email no recibido de Google" });
      }
  
    // Obtener el correo electrónico del perfil de Google
    const email = profile.emails[0].value;
    console.log("Email del usuario:", email);

    // Verificar si el correo existe en tu base de datos
    try {
      const [rows] = await Usuario.fetchOne(email);
      console.log("Resultado de búsqueda en BD:", rows.length > 0 ? "Usuario encontrado" : "Usuario no encontrado");
      
      if (rows.length === 0) {
        // Usuario no existe en tu sistema
        console.log("Usuario no encontrado en la base de datos");
        return done(null, false, { message: 'Usuario no registrado en el sistema' });
      }
      
      // El usuario existe, pasamos el perfil completo de Google y la info de tu BD
      console.log("Usuario encontrado, procediendo con la autenticación");
      return done(null, {
        message: 'Usuario EXISTE en el sistema',
        googleProfile: profile,
        dbUser: rows[0]
      });
    } catch (err) {
      console.error("Error al buscar usuario:", err);
      return done(err);
    }
  }
));

// Configurar la serialización/deserialización
passport.serializeUser((user, done) => {
    // Para usuarios de la estrategia local
    if (!user.googleProfile) {
      return done(null, { id: user.idUsuario, type: 'local' });
    }
    
    // Para usuarios de Google
    return done(null, { 
      id: user.dbUser.idUsuario, 
      type: 'google',
      email: user.dbUser.Correo_electronico
    });
  });
  
  passport.deserializeUser((serializedUser, done) => {
    // Dependiendo del tipo, recuperamos el usuario
    if (serializedUser.type === 'local') {

            Usuario.fetchOne(serializedUser.id) // O podrías crear un método fetchById en tu modelo
        .then(([rows]) => {
          if (rows.length === 0) {
            return done(null, false);
          }
          done(null, rows[0]);
        })
        .catch(err => done(err));
    } else if (serializedUser.type === 'google') {
        Usuario.fetchOne(serializedUser.id)
        .then(([rows]) => {
          if (rows.length === 0) {
            return done(null, false);
          }
          done(null, rows[0]);
        })
        .catch(err => done(err));
    } else {
      done(null, serializedUser); // Fallback
    }
  });
  
  
module.exports = passport;