// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/usuario.model');

module.exports = function(passport) {
  // Ensure environment variables are loaded
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables must be set');
    console.error('Make sure your .env file is properly configured');
    // Don't crash the server, just log the error
    return;
  }

  // Configure Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google authentication callback initiated");
          
          // Obtain authenticated user
          const user = await Usuario.authenticateWithGoogle(profile);
          
          if (!user) {
            console.error("Authentication failed: No user returned");
            return done(null, false, { message: 'La autenticación falló' });
          }
          
          console.log("Authentication successful for user ID:", user.idUsuario);
          return done(null, user);
        } catch (error) {
          console.error("Error in Google strategy callback:", error);
          return done(error, null);
        }
      }
    )
  );

  // Serialization and deserialization
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.idUsuario);
    
    if (user && user.idUsuario !== undefined) {
      return done(null, user.idUsuario);
    } else {
      console.error("Serialization failed: Missing user ID", user);
      return done(new Error("Invalid user object"), null);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log("Deserializing user ID:", id);
      
      const [rows] = await Usuario.findById(id);
      
      if (rows.length === 0) {
        console.error("Deserialization failed: User not found", id);
        return done(null, false);
      }
      
      console.log("User deserialized successfully");
      done(null, rows[0]);
    } catch (error) {
      console.error("Error in deserialization:", error);
      done(error, null);
    }
  });
};