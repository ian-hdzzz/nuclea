const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/usuario.model');
const db = require('../util/database');

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  Usuario.findOrCreateGoogleUser({
    email: profile.emails[0].value,
    given_name: profile.name.givenName || profile.displayName.split(' ')[0],
    family_name: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' ')
  })
  .then(user => {
    return done(null, user);
  })
  .catch(err => {
    return done(err, null);
  });
}
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.idUsuario);
});

passport.deserializeUser((id, done) => {
  db.execute("SELECT * FROM Usuarios WHERE idUsuario = ?", [id])
    .then(([users]) => {
      if (users.length > 0) {
        done(null, users[0]);
      } else {
        done(new Error('User not found'), null);
      }
    })
    .catch(err => done(err, null));
});

module.exports = passport;