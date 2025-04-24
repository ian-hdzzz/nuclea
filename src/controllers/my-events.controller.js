// controllers/eventosController.js
const Evento = require('../models/evento.model');
const Tipo = require('../models/tipo.model');

// Controlador para eventos
const eventosController = {
    // Obtener todos los eventos
    getAll: async (req, res) => {
        try {
            // Obtener el ID del usuario de la sesión
            const usuarioId = req.session.userId;
            
            // Consultar eventos para este usuario
            const eventos = await Evento.findByUsuarioId(usuarioId);
            
            // Consultar todos los tipos de eventos
            const tipos = await Tipo.findAll();
            
            // Mapear los tipos para tener un acceso rápido por ID
            const tiposMap = {};
            tipos.forEach(tipo => {
                tiposMap[tipo.tipo_id] = {
                    nombre: tipo.nombre,
                    color: tipo.color
                };
            });
            
            // Agregar información de color a cada evento
            const eventosConTipo = eventos.map(evento => {
                const tipoInfo = tiposMap[evento.tipoId] || { nombre: 'Otro', color: '#CCCCCC' };
                return {
                    ...evento,
                    tipoNombre: tipoInfo.nombre,
                    color: tipoInfo.color
                };
            });
            
            res.json(eventosConTipo);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            res.status(500).json({ error: 'Error al obtener eventos' });
        }
    },
    // Renderizar la vista de calendario
    renderCalendario: async (req, res) => {
        // Sample data structure to be used with the Handlebars template
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
        try {
            // Obtener el ID del usuario de la sesión
            const usuarioId = req.session.userId;
            
            // Consultar tipos de eventos para mostrar la leyenda
            const tipos = await Tipo.findAll();
            
            res.render('./pages/my-events', { 
                title: 'Mi Calendario',
                tipos: tipos,
                usuarioId: usuarioId,
                sidebarData: sidebarData 
            });
        } catch (error) {
            console.error('Error al renderizar calendario:', error);
            res.status(500).send('Error al cargar la página');
        }
    }
};

module.exports = eventosController;