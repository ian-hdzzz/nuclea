const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const canviewAdmin = require('../util/canviewAdmin');
const router = express.Router();


// Definir rutas
router.get('/my-events',isAuth, (req, res) => {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);
  res.render('./pages/my-events', {
    title: 'My events',
    csrfToken: req.csrfToken(),
    iconClass: 'fa-regular fa-calendar',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
  });
});
router.post('/my-event', express.json(), async (req, res) => {
  try {
    // Datos del evento desde el cuerpo de la solicitud
    const { summary, description, start, end } = req.body;
    
    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'America/Los_Angeles', // Ajusta a tu zona horaria
      },
      end: {
        dateTime: end,
        timeZone: 'America/Los_Angeles', // Ajusta a tu zona horaria
      }
    };
    
    const resultado = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    res.json(resultado.data);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).send('Error al crear evento en calendario');
  }
});

module.exports =  router;