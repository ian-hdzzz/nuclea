// interview controller
const OneToOneModel = require('../models/oneToOneModel');
const Questions = require('../models/oneToOneModel');
const SearchModel = require('../models/search.model'); 
const { differenceInYears, differenceInMonths, differenceInDays } = require('date-fns');

exports.getOneToOne = async (req, res) => {
    try {
        // Obtener empleados de la base de datos usando tu modelo existente
        const employeesData = await SearchModel.getAllEmployees();
        
        // Formatear empleados para el componente de búsqueda
        const employees = employeesData.map(emp => ({
            id: emp.idUsuario || '',
            // Usar operador de coalescencia nula para evitar 'undefined'
            name: `${emp.nombre || ''} ${emp.apellidos || ''}`.trim(),
            initial: emp.nombre ? emp.nombre.charAt(0).toUpperCase() : ''
        }));

        res.render('pages/one-to-one', { 
            title: 'One-to-One ', 
            iconClass: 'fa-solid fa-people-arrows',
            employees: employees // Pasar los empleados formateados a la vista
        });
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página One-to-One',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

exports.getInterview = async (req, res) => {
    try {
        const entrevistadorId = req.session.idUsuario;
        const entrevistadorName = req.session.name;
        const employeeId = req.query.employee;

        // Obtener los detalles del empleado
        const employee = await OneToOneModel.getEmployeeById(employeeId);

        // Obtener la última entrevista completada del empleado
        const [lastInterview] = await Questions.getSpecificInterviewHistory(employeeId);
        
        if (!employee) {
            return res.status(404).render('error', {
                message: 'Empleado no encontrado',
                error: { status: 404 }
            });
        }

        // Obtener inicial de usuario
        employee.initial = employee.Nombre.charAt(0).toUpperCase();

        // Calcular tiempo en la empresa
        const currentDate = new Date();
        const startDate = new Date(employee.Fecha_inicio_colab);
        const years = differenceInYears(currentDate, startDate);
        const months = differenceInMonths(currentDate, startDate) % 12;
        const days = differenceInDays(currentDate, startDate) % 30;
        employee.timeInCompany = `${years} year(s), ${months} month(s), ${days} day(s)`;

        // Obtener preguntas y respuestas si hay una entrevista anterior
        let preguntas = await Questions.getQuestions();
        let openResponses = [];
        let closedResponses = [];
        let comentarios = {
            admin: '',
            colaborador: ''
        };

        if (lastInterview) {
            openResponses = await Questions.getOpenResponses(lastInterview.entrevistaId);
            closedResponses = await Questions.getClosedResponses(lastInterview.entrevistaId);
            comentarios = {
                admin: lastInterview.comentariosAdmin || '',
                colaborador: lastInterview.comentariosColaborador || ''
            };
        }

        res.render('pages/interview', {
            title: 'Interview',
            iconClass: 'fa-solid fa-people-arrows',
            preguntas,
            entrevistadorId,
            employee,
            openResponses,
            closedResponses,
            comentarios,
            csrfToken: req.csrfToken(),
            departamento: req.session.departamento || [],
            lastInterview: lastInterview || null
        });
    } catch (error) {
        console.error('Error al cargar la entrevista:', error);
        res.status(500).render('error', {
            message: 'Error al cargar la página de entrevista',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

exports.getInterviewEdit = async (req, res) => {
    try {
        const preguntas = await Questions.getQuestions();
        console.log('Preguntas obtenidas:', preguntas);
        res.render('pages/interviewEdit',{ 
            title: 'Edit Interview', 
            iconClass:'fa-solid fa-people-arrows',
            preguntas
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página de edición de entrevistas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Nuevo método para guardar las entrevistas
// Updated saveInterview method to handle comments
exports.saveInterview = async (req, res) => {
    try {
        // Obtener datos del cuerpo de la petición
        const { idUsuario, tipoPregunta, respuestas, comentariosAdmin, comentariosColaborador } = req.body;
        const idUsuarioA = req.session.idUsuario;

        console.log('Datos extraídos:', { 
            idUsuario, 
            tipoPregunta, 
            respuestas: respuestas ? 'presente' : 'ausente',
            comentariosAdmin: comentariosAdmin ? 'presente' : 'ausente',
            comentariosColaborador: comentariosColaborador ? 'presente' : 'ausente',
            idUsuarioA
        });

        if (!idUsuarioA) {
            return res.status(401).json({
                success: false,
                message: 'No hay sesión activa o no se pudo identificar al entrevistador'
            });
        }
        if (!respuestas) {
            return res.status(400).json({
                success: false,
                message: 'No se recibieron respuestas'
            });
        }
        
        // Si es la primera parte de la entrevista (preguntas abiertas), creamos una nueva
        if (tipoPregunta === 'open') {
            // Guardar nueva entrevista con comentarios
            const entrevistaId = await Questions.saveInterview({
                idUsuario, 
                idUsuarioA,
                comentariosAdmin,
                comentariosColaborador
            });
            
            // Guardar entrevistaId en la sesión para la segunda parte
            req.session.currentEntrevistaId = entrevistaId;
            
            // Procesar y guardar respuestas abiertas (excluir campos de comentarios si están en respuestas)
            const respuestasToSave = { ...respuestas };
            delete respuestasToSave.comentariosAdmin;
            delete respuestasToSave.comentariosColaborador;
            
            await Questions.saveAnswers(entrevistaId, respuestasToSave);
            
            return res.status(200).json({
                success: true,
                message: 'Primera parte de la entrevista guardada',
                entrevistaId
            });
        } 
        // Si es la segunda parte (preguntas cerradas), actualizamos la entrevista existente
        else if (tipoPregunta === 'closed') {
            // Recuperar el ID de la entrevista de la sesión
            const entrevistaId = req.session.currentEntrevistaId;
            
            if (!entrevistaId) {
                return res.status(400).json({
                    success: false,
                    message: 'No se encontró una entrevista en curso'
                });
            }
            
            // Actualizar comentarios si se modificaron en la segunda fase
            if (comentariosAdmin || comentariosColaborador) {
                await Questions.updateInterviewComments(entrevistaId, comentariosAdmin, comentariosColaborador);
            }
            
            // Procesar respuestas numéricas (excluir campos de comentarios)
            const processedResponses = {};
            for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
                if (preguntaId !== 'comentariosAdmin' && preguntaId !== 'comentariosColaborador') {
                    processedResponses[preguntaId] = parseInt(respuesta, 10);
                }
            }
            
            // Guardar respuestas cerradas
            await Questions.saveAnswers(entrevistaId, processedResponses);
            
            // Marcar la entrevista como completada
            await Questions.completeInterview(entrevistaId);
            
            // Limpiar la sesión
            delete req.session.currentEntrevistaId;
            
            return res.status(200).json({
                success: true,
                message: 'Entrevista completada exitosamente',
                entrevistaId
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Tipo de pregunta no válido'
            });
        }
    } catch (error) {
        console.error('Error al guardar la entrevista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la entrevista'
        });
    }
};

exports.getEmployeeHistory = async (req, res) => {
    try {
        const employeeId = req.params.id;
        console.log('ID del empleado:', employeeId);
        
        // Get employee details
        const employee = await SearchModel.getEmployeeById(employeeId);
        
        // Get interview history - Pass employeeId instead of employee object
        const interviewHistory = await Questions.getSpecificInterviewHistory(employeeId);
        
        // Format the data for the frontend
        const formattedInterviews = interviewHistory.map(interview => ({
            id: interview.entrevistaId,
            fechaEntrevista: interview.fechaEntrevista,
            empleadoId: interview.empleadoId,
            empleadoNombre: `${employee.Nombre || ''} ${employee.Apellidos || ''}`.trim(),
            entrevistadorId: interview.entrevistadorId,
            entrevistadorNombre: `${interview.entrevistadorNombre || ''} ${interview.entrevistadorApellidos || ''}`.trim(),
            completada: interview.completada
        }));
        console.log(employee)
        res.json({
            success: true,
            employee: {
                id: employee.idUsuario,
                nombre: employee.Nombre,
                apellidos: employee.Apellidos || '',
                puesto: employee.Puesto || '',
                modalidad: employee.Modalidad || '',
                departamento: employee.Nombre_Departamento || '',
                fechaInicio: employee.Fecha_inicio_colab,
                initial: employee.Nombre ? employee.Nombre.charAt(0).toUpperCase() : ''
            },
            interviewHistory: formattedInterviews
        });
    } catch (error) {
        console.error('Error al obtener historial de entrevistas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de entrevistas'
        });
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
// Add this to your oneToOneController.js

exports.getInterviewDetails = async (req, res) => {
    try {
        const interviewId = req.params.id;

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
// Graph render controllers
exports.getEmployeeGraph = async (req, res) => {
    try {
        const employeeId = req.params.id;
        // Obtener las respuestas cerradas del empleado específico
        const result = await Questions.getEmployeeClosedResponsesAverage(employeeId);
        const closedResponses = result[0]; // Accede al primer elemento que contiene los datos reales
        
        console.log('Respuestas procesadas del empleado:', closedResponses);
        
        // Return JSON data instead of rendering a partial
        res.json({
            success: true,
            graphData: {
                workload: parseFloat(closedResponses[0]?.valorRespuesta || 0),
                health: parseFloat(closedResponses[1]?.valorRespuesta || 0),
                recognition: parseFloat(closedResponses[2]?.valorRespuesta || 0),
                emotionalHealth: parseFloat(closedResponses[3]?.valorRespuesta || 0),
                workLifeBalance: parseFloat(closedResponses[4]?.valorRespuesta || 0)
            }
        });
    } catch (error) {
        console.error(`Error al obtener datos del gráfico para el empleado ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar datos del gráfico'
        });
    }
};

exports.getAllEmployeesGraph = async (req, res) => {
    try {
      // Get all closed responses from completed interviews
      let closedResponses = await Questions.getAllClosedResponsesAverage();
      
      // Check if the response is an array of arrays (containing both data and schema)
      if (Array.isArray(closedResponses) && Array.isArray(closedResponses[0])) {
        // Extract just the data part (first element of the array)
        closedResponses = closedResponses[0];
      }
      
      // Check if we have valid data
      if (!closedResponses || !Array.isArray(closedResponses) || closedResponses.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No data available for graph',
          graphData: {
            workload: 0,
            health: 0,
            recognition: 0,
            emotionalHealth: 0,
            workLifeBalance: 0
          }
        });
      }
      
      // Return JSON data (removed the conflicting res.render call)
      res.json({
        success: true,
        graphData: {
          workload: closedResponses[0]?.valorRespuesta || 0,
          health: closedResponses[1]?.valorRespuesta || 0,
          recognition: closedResponses[2]?.valorRespuesta || 0,
          emotionalHealth: closedResponses[3]?.valorRespuesta || 0,
          workLifeBalance: closedResponses[4]?.valorRespuesta || 0
        }
      });
    } catch (error) {
      console.error('Error al obtener datos para el gráfico:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cargar datos del gráfico'
      });
    }
  };
// Logica para CRUD de preguntas


exports.createQuestion = async (req, res) => {
    try {
        const { pregunta, descripcionPregunta, tipoPregunta, orden } = req.body;
        
        // Validate required fields
        if (!pregunta || !tipoPregunta) {
            return res.status(400).json({
                success: false,
                message: 'Question and type are required'
            });
        }
        
        // Create question in the database
        const questionId = await Questions.createQuestion({
            pregunta,
            descripcionPregunta,
            tipoPregunta,
            orden: orden || 0 // Default order if not provided
        });
        
        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            questionId
        });
    } catch (error) {
        console.error('Error creating question', error);
        res.status(500).json({
            success: false,
            message: 'Error creating question'
        });
    }
};

// Update an existing question
exports.updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const { pregunta, descripcionPregunta, tipoPregunta, orden } = req.body;
        
        // Validate question ID
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'Question ID was not provided'
            });
        }
        
        // Update question in the database
        const updated = await Questions.updateQuestion(questionId, {
            pregunta,
            descripcionPregunta,
            tipoPregunta,
            orden
        });
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Question updated successfully'
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating question'
        });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        
        // Validate question ID
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'Question ID was not provided'
            });
        }
        
        // Delete question and its responses from the database
        const deleted = await Questions.deleteQuestion(questionId);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Question not found or could not be deleted'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Question and associated responses deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting question: ' + (error.message || 'Unknown error occurred')
        });
    }
};