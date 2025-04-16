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
        console.log('ID del entrevistador:', entrevistadorId, 'Nombre:', entrevistadorName); 

        const preguntas = await Questions.getQuestions();
        const employeeInterviewHistory = await Questions.getEmployeeInterviewHistory();
        const employeeId = req.query.employee;

        const employee = await SearchModel.getEmployeeById(employeeId);

        // Obtener inicial de usuario
        employee.initial = employee.Nombre.charAt(0).toUpperCase();

        // Obtener el tiempo del usuario en la empresa
        const currentDate = new Date();
        const startDate = new Date(employee.Fecha_inicio_colab);

        const years = differenceInYears(currentDate, startDate);
        const months = differenceInMonths(currentDate, startDate) % 12;
        const days = differenceInDays(currentDate, startDate) % 30; // Aproximación de días en el mes
        employee.timeInCompany = `${years} años, ${months} meses, ${days} días`;

        res.render('pages/interview',{ 
            title: 'Interview', 
            iconClass:'fa-solid fa-people-arrows',
            preguntas,
            employeeInterviewHistory,
            entrevistadorId,
            employee,
            csrfToken: req.csrfToken(),
            departamento: req.session.departamento || [],
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la página de entrevistas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

exports.getInterviewEdit = async (req, res) => {
    try {
        const preguntas = await Questions.getQuestions();

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
exports.saveInterview = async (req, res) => {
    try {

        // Obtener datos del cuerpo de la petición
        const { idUsuario, tipoPregunta, respuestas } = req.body;
        const idUsuarioA = req.session.idUsuario;

        console.log('Datos extraídos:', { 
            idUsuario, 
            tipoPregunta, 
            respuestas: respuestas ? 'presente' : 'ausente',
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
            // Guardar nueva entrevista
            const entrevistaId = await Questions.saveInterview({
                idUsuario, 
                idUsuarioA
            });
            
            // Guardar entrevistaId en la sesión para la segunda parte
            req.session.currentEntrevistaId = entrevistaId;
            
            // Procesar y guardar respuestas abiertas
            await Questions.saveAnswers(entrevistaId, respuestas);
            
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
            
            // Procesar respuestas numéricas
            const processedResponses = {};
            for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
                processedResponses[preguntaId] = parseInt(respuesta, 10);
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
