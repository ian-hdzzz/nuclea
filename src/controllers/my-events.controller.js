// controllers/eventosController.js
const Evento = require('../models/evento.model');
const Tipo = require('../models/tipo.model');

const eventosController = {
    getAll: async (req, res) => {
        try {
            const eventos = await Evento.findByUsuarioId(req.session.idUsuario);
            const tipos = await Tipo.findAll();
            
            // Mapear los tipos para acceso rápido
            const tiposMap = {};
            tipos.forEach(tipo => {
                tiposMap[tipo.tipo_id] = {
                    nombre: tipo.nombre,
                    color: tipo.color
                };
            });
            
            // Procesar eventos y asegurar que las fechas sean válidas
            const eventosFormateados = eventos
                .filter(evento => evento.fechaInicio && evento.fechaFin)
                .map(evento => {
                    // Crear fechas y ajustar la zona horaria
                    const start = new Date(evento.fechaInicio);
                    start.setDate(start.getDate() + 1); // Ajustar el día
                    
                    const end = new Date(evento.fechaFin);
                    end.setDate(end.getDate() + 1); // Ajustar el día
                    
                    // Verificar si las fechas son válidas
                    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                        console.error('Fechas inválidas para evento:', evento);
                        return null;
                    }

                    // Si hay horas específicas y no es un evento de día completo
                    if (evento.horaInicio && evento.horaFin && !evento.diaCompleto) {
                        const [startHours, startMinutes] = evento.horaInicio.split(':');
                        const [endHours, endMinutes] = evento.horaFin.split(':');
                        
                        start.setHours(parseInt(startHours), parseInt(startMinutes));
                        end.setHours(parseInt(endHours), parseInt(endMinutes));
                    }

                    return {
                        id: evento.eventoId,
                        title: evento.titulo,
                        description: evento.descripcion,
                        start: start.toISOString(),
                        end: end.toISOString(),
                        allDay: evento.diaCompleto === 1,
                        type: evento.tipoId,
                        color: evento.tipoColor || tiposMap[evento.tipoId]?.color || '#6C7280'
                    };
                })
                .filter(Boolean);
            
            console.log('Eventos formateados:', eventosFormateados);
            
            res.json(eventosFormateados);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            res.status(500).json({ error: 'Error al obtener eventos' });
        }
    },

    renderCalendario: async (req, res) => {
        try {
            // Obtener todos los eventos del usuario
            const eventos = await Evento.findByUsuarioId(req.session.idUsuario);
            const tipos = await Tipo.findAll();

            // Agrupar eventos por tipo
            const eventosPorTipo = {};
            tipos.forEach(tipo => {
                eventosPorTipo[tipo.tipo_id] = {
                    tipo_id: tipo.tipo_id,
                    nombre: tipo.nombre,
                    color: tipo.color,
                    count: 0,
                    events: []
                };
            });

            // Procesar y contar eventos
            eventos
                .filter(evento => evento.fechaInicio && evento.fechaFin)
                .forEach(evento => {
                    if (eventosPorTipo[evento.tipoId]) {
                        eventosPorTipo[evento.tipoId].count++;
                        eventosPorTipo[evento.tipoId].events.push({
                            name: evento.titulo,
                            date: formatDateRange(
                                new Date(evento.fechaInicio),
                                new Date(evento.fechaFin)
                            ),
                            allDay: evento.diaCompleto === 1,
                            time: !evento.diaCompleto ? formatTimeRange(evento.horaInicio, evento.horaFin) : null
                        });
                    }
                });

            const sidebarData = {
                eventTypes: Object.values(eventosPorTipo)
            };

            res.render('./pages/my-events', {
                title: 'Mi Calendario',
                tipos: tipos,
                usuarioId: req.session.idUsuario,
                sidebarData: sidebarData,
                GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
                GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
                iconClass: 'fa-regular fa-calendar'
            });
        } catch (error) {
            console.error('Error al renderizar calendario:', error);
            res.status(500).send('Error al cargar la página');
        }
    },

    createEvent: async (req, res) => {
        try {
            // Implementar lógica para crear evento
            res.status(501).json({ message: 'Función no implementada' });
        } catch (error) {
            console.error('Error al crear evento:', error);
            res.status(500).json({ error: 'Error al crear el evento' });
        }
    },

    syncGoogleEvents: async (req, res) => {
        try {
            // Implementar lógica de sincronización
            res.status(501).json({ message: 'Función no implementada' });
        } catch (error) {
            console.error('Error al sincronizar con Google:', error);
            res.status(500).json({ error: 'Error al sincronizar eventos' });
        }
    }
};

// Funciones auxiliares
function formatDateRange(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
    }
    
    if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString();
    }
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}

function formatTimeRange(startTime, endTime) {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime}`;
}

module.exports = eventosController;