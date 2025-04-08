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
            name: `${emp.nombre || ''} ${emp.apellidos}`.trim(),
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
        const preguntasAbiertas = await Questions.getOpenQuestions();
        const preguntasCerradas = await Questions.getOptionQuestions();
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
        
        console.log('Employee details:', employee);

        res.render('pages/interview',{ 
            title: 'Interview', 
            iconClass:'fa-solid fa-people-arrows',
            preguntasAbiertas,
            preguntasCerradas,
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
        const preguntasAbiertas = await Questions.getOpenQuestions();
        const preguntasCerradas = await Questions.getOptionQuestions();
        
        res.render('pages/interviewEdit',{ 
            title: 'Edit Interview', 
            iconClass:'fa-solid fa-people-arrows',
            preguntasAbiertas,
            preguntasCerradas
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).rendxer('error', { 
            message: 'Error al cargar la página de edición de entrevistas',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Agregar un controlador para manejar las búsquedas AJAX
exports.searchEmployees = async (req, res) => {
    try {
        const searchTerm = req.query.term || '';
        
        // Usamos tu método existente para buscar usuarios
        const employeesData = await SearchModel.searchUsers(searchTerm);
        
        // Formatear para la respuesta
        const employees = employeesData.map(emp => ({
            id: emp.idUsuario || '',
            name: `${emp.Nombre} ${emp.Apellido || ''}`.trim(),
            initial: emp.Nombre.charAt(0).toUpperCase(),

        }));
        
        // Devolver como JSON para peticiones AJAX
        res.json({ contacts: employees });
    } catch (error) {
        console.error('Error en búsqueda de empleados:', error);
        res.status(500).json({ 
            error: 'Error al buscar empleados',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

exports.postInterview = async (req, res) => {
    try {
      const userId = req.params.id;
      const responses = req.body.respuestas || {};
      
      const result = await OneToOneModel.saveOpenQuestionResponses(userId, responses);
      
      res.json(result);
    } catch (error) {
      console.error('Error in postInterview:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.postClosedQuestions = async (req, res) => {
    try {
      const userId = req.params.id;
      const responses = req.body.closedResponses || {};
      
      const result = await OneToOneModel.saveClosedQuestionResponses(userId, responses);
      
      res.json(result);
    } catch (error) {
      console.error('Error in postClosedQuestions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Make sure this route is defined in your router
  // router.post('/interview/:id', interviewController.postInterview);