const OneToOneModel = require('../models/oneToOneModel');
const Questions = require('../models/oneToOneModel');
const Usuario = require('../models/usuario.model');
const SearchModel = require('../models/search.model');
const Evento = require('../models/evento.model');
const Tipo = require('../models/tipo.model');


exports.getOneEmployee = async (req, res) => {

    const idUsuario = req.session.idUsuario;
    const [[user]] = await Usuario.fetchbyId(idUsuario);
    const employee = await SearchModel.getEmployeeById(idUsuario);
    console.log("User:", idUsuario);

    const closedResponses = await Questions.getAllClosedResponsesAverage(idUsuario);
     // Obtener eventos
     const eventos = await Evento.findByUsuarioId(idUsuario);
     const tipos = await Tipo.findAll();
     
     const eventosPorTipo = {};
     tipos.forEach(tipo => {
         eventosPorTipo[tipo.tipo_id] = {
             tipo_id: tipo.tipo_id,
             nombre: tipo.nombre,
             color: tipo.color,
             count: 0,
             items: []
         };
     });
     const tiposMap = {};
     tipos.forEach(tipo => {
         tiposMap[tipo.tipo_id] = {
             nombre: tipo.nombre,
             color: tipo.color
         };
     });

     const eventosFormateados = eventos
         .filter(evento => evento.fechaInicio && evento.fechaFin)
         .map(evento => {
             const start = new Date(evento.fechaInicio);
             start.setDate(start.getDate() + 1);

             const end = new Date(evento.fechaFin);
             end.setDate(end.getDate() + 1);

             if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                 console.error('Fechas inválidas para evento:', evento);
                 return null;
             }

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
         
 
             eventos
                 .filter(evento => evento.fechaInicio && evento.fechaFin)
                 .forEach(evento => {
                     if (eventosPorTipo[evento.tipoId]) {
                         eventosPorTipo[evento.tipoId].count++;
                         
                         const startDate = new Date(evento.fechaInicio);
                         
                         // Format all events to show only start date and time
                         eventosPorTipo[evento.tipoId].items.push({
                             name: evento.titulo,
                             startDate: startDate.toLocaleDateString(),
                             startTime: evento.horaInicio,
                         });
                     }
                 });
 

    res.render('pages/oneEmployee', { 
        title: 'One-to-One ', 
        iconClass: 'fa-solid fa-people-arrows',
        closedResponses: closedResponses,
        idUsuario: idUsuario,
        user: user,
        employee :{
                id: employee.idUsuario,
                nombre: employee.Nombre,
                apellidos: employee.Apellidos || '',
                modalidad: employee.Modalidad || '',
                departamento: employee.Departamento || '',
                initial: employee.Nombre ? employee.Nombre.charAt(0).toUpperCase() : ''
        },
        eventos: eventosFormateados,
        oneToOne: eventosPorTipo[2] || { count: 0, items: [] }, 
        
    });
}

exports.getEmployeeHistory = async (req, res) => {
    try {
        const idUsuario = req.session.idUsuario;

        const [[user]] = await Usuario.fetchbyId(idUsuario);
        const employee = await SearchModel.getEmployeeById(idUsuario);
        const closedResponses = await Questions.getAllClosedResponsesAverage(idUsuario);
        const interviewHistory = await Questions.getAllCompletedInterviewHistory(idUsuario);

        // Ensure interview history has the expected format for the handlebars template
        const formattedInterviewHistory = interviewHistory.map(interview => ({
            idUsuario: interview.entrevistaId, // For the data-id attribute in the template
            fechaEntrevista: interview.fechaEntrevista,
            entrevistadorNombre: interview.entrevistadorNombre || '',
            entrevistadorApellidos: interview.entrevistadorApellidos || '',
            completada: interview.completada
        }));

        res.json({
            success: true,
            employee: {
                id: employee.idUsuario,
                nombre: employee.Nombre,
                apellidos: employee.Apellidos || '',
                modalidad: employee.Modalidad || '',
                departamento: employee.Departamento || '',
                initial: employee.Nombre ? employee.Nombre.charAt(0).toUpperCase() : ''
            },
            closedResponses: closedResponses,
            interviewHistory: formattedInterviewHistory,
        });
    } catch (error) {
        console.error('Error al obtener historial de empleado:', error);
        res.status(500).json({ error: 'Error al obtener historial de empleado' });
    }
};
exports.getAllInterviewHistory = async (req, res) => {
    try {
        // Get all completed interviews
        const allInterviews = await Questions.getAllCompletedInterviewHistory();
        
        // Format the data for the frontend
        const formattedInterviews = allInterviews.map(interview => ({
            id: interview.entrevistaId,
            fechaEntrevista: interview.fechaEntrevista,
            empleadoId: interview.empleadoId,
            empleadoNombre: `${interview.empleadoNombre || ''} ${interview.empleadoApellidos || ''}`.trim(),
            entrevistadorId: interview.entrevistadorId,
            entrevistadorNombre: `${interview.entrevistadorNombre || ''} ${interview.entrevistadorApellidos || ''}`.trim(),
            completada: interview.completada
        }));
        
        res.json({
            success: true,
            interviews: formattedInterviews
        });
    } catch (error) {
        console.error('Error al obtener historial de entrevistas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de entrevistas'
        });
    }
};

exports.getInterviewDetails = async (req, res) => {
    try {
        const interviewId = req.params.id;
        console.log('Interview ID:', interviewId);
        // Get interview details
        const interview = await Questions.getInterviewById(interviewId);
        
        if (!interview) {
            return res.status(404).render('error', { 
                message: 'Entrevista no encontrada',
                error: { status: 404 }
            });
        }
        
        // Get employee and interviewer details
        const employee = await SearchModel.getEmployeeById(interview.empleadoId);
        const interviewer = await SearchModel.getEmployeeById(interview.entrevistadorId);
        
        // Get open and closed questions with responses
        const openResponses = await Questions.getOpenResponses(interviewId);
        const closedResponses = await Questions.getClosedResponses(interviewId);
        console.log('Closed responseeees:', closedResponses);
        // Format date
        const formattedDate = interview.fechaEntrevista ? 
            new Date(interview.fechaEntrevista).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) : 'N/A';
            
        res.render('pages/interviewDetails', { 
            title: 'Interview Details', 
            iconClass: 'fa-solid fa-people-arrows',
            interview: {
                id: interview.entrevistaId,
                date: formattedDate,
                completed: interview.completada,
                comentariosAdmin: interview.comentariosAdmin || '',
                comentariosColaborador: interview.comentariosColaborador || ''
            },
            employee: {
                id: employee.idUsuario,
                nombre: employee.Nombre,
                apellidos: employee.Apellidos || '',
                modalidad: employee.Modalidad || '',
                departamento: employee.Departamento || '',
                initial: employee.Nombre ? employee.Nombre.charAt(0).toUpperCase() : ''
            },
            interviewer: {
                id: interviewer.idUsuario,
                nombre: interviewer.Nombre,
                apellidos: interviewer.Apellidos || '',
                puesto: interviewer.Puesto || ''
            },
            openResponses: openResponses,
            closedResponses: closedResponses
        });
    } catch (error) {
        console.error('Error al obtener detalles de la entrevista:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar los detalles de la entrevista',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};