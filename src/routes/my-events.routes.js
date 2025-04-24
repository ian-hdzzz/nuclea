const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const canviewAdmin = require('../util/canviewAdmin');
const eventosController = require('../controllers/my-events.controller');
const router = express.Router();

const sidebarData = {
  eventTypes: [
    {
      tipo_id: 1,
      nombre: "Vacations",
      color: "#3B82F6",
      count: 7,
      events: [
        {
          name: "Summer Vacation",
          date: "10 Feb - 15 Feb 2025",
          allDay: true
        },
        {
          name: "Weekend Trip",
          date: "22 Feb - 23 Feb 2025",
          allDay: true
        }
      ]
    },
    {
      tipo_id: 2,
      nombre: "One-to-one",
      color: "#8B5CF6",
      count: 2,
      events: [
        {
          name: "Meeting with Manager",
          date: "5 Feb 2025",
          allDay: false,
          time: "10:00 - 11:00"
        },
        {
          name: "Team Feedback Session",
          date: "12 Feb 2025",
          allDay: false,
          time: "15:30 - 16:30"
        }
      ]
    },
    {
      tipo_id: 3,
      nombre: "Holidays",
      color: "#21C55E",
      count: 9,
      events: [
        {
          name: "Valentine's Day",
          date: "14 Feb 2025",
          allDay: true
        },
        {
          name: "President's Day",
          date: "17 Feb 2025",
          allDay: true
        }
      ]
    },
    {
      tipo_id: 4,
      nombre: "Non-working-days",
      color: "#6C7280",
      count: 4,
      events: [
        {
          name: "Weekend",
          date: "1 Feb - 2 Feb 2025",
          allDay: true
        },
        {
          name: "Weekend",
          date: "8 Feb - 9 Feb 2025",
          allDay: true
        }
      ]
    }
  ]
};
// Definir rutas
router.get('/my-events',isAuth, (req, res) => {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);
  res.render('./pages/my-events', {
    title: 'My events',
    csrfToken: req.csrfToken(),
    iconClass: 'fa-regular fa-calendar',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    sidebarData: sidebarData,
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
// router.get('/my-events', eventosController.renderCalendario);
// router.get('/api/events', eventosController.getAll);
module.exports =  router;