const searchModel = require('../models/search.model');


exports.processSearch = async (req, res, next) => {
  try {
    const searchTerm = req.query.term || '';
    const searchType = req.query.type || 'users'; // Por defecto, buscar usuarios
    
    let results = [];
    let viewData = {};
    
    // Determinar qué tipo de búsqueda realizar
    switch (searchType) {
        case 'users':
          results = await searchModel.searchUsers(searchTerm);
          // Formatear resultados para la vista
          viewData.contacts = results.map(user => ({
            id: user.idUsuario,
            name: `${user.nombre} ${user.apellidos || '' }`.trim(),
            initial: user.nombre.charAt(0).toUpperCase()
          }));
          break;
        // Casos extra para las búsquedas
        default:
          results = await searchModel.searchUsers(searchTerm);
          viewData.contacts = results.map(user => ({
            id: user.idUsuario,
            name: `${user.nombre} ${user.apellidos}`,
            initial: user.nombre.charAt(0).toUpperCase()
          }));
      }
    
    // Si es una petición AJAX, devolver JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json(viewData);
    }
    
    // Si no, pasar los datos al siguiente middleware o renderizar una vista
    res.locals.searchData = viewData;
    next();
  } catch (error) {
    console.error('Error en el controlador de búsqueda:', error);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: 'Error en la búsqueda' });
    }
    
    next(error);
  }
};

// Middleware para renderizar el componente de búsqueda
exports.renderSearchComponent = async (req, res) => {
  try {
    // Use existing search data if available, otherwise initialize empty
    const viewData = res.locals.searchData || { contacts: [] };
    
    // If no search term was provided, load some default employees (up to 3)
    if (!req.query.term) {
      const defaultEmployees = await searchModel.getDefaultEmployees(3); 
      console.log('Empleados por defecto:', defaultEmployees);
      // Format employees for the view
      viewData.employee = defaultEmployees.map(user => ({
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos || '',
        initial: user.nombre.charAt(0).toUpperCase()
      }));
    }
    
    // Component configuration
    viewData.title = req.query.title || 'Buscar Contactos';
    viewData.placeholder = req.query.placeholder || 'Search...';
    viewData.searchId = req.query.searchId || `search-${Date.now()}`;
    
    res.render('partials/searchContacts', viewData);
  } catch (error) {
    console.error('Error loading default employees:', error);
    res.status(500).send('Error loading search component');
  }
};
// Nueva función para manejar la ruta de detalles del empleado
exports.renderEmployeeDetails = async (req, res) => {
    try {
      const employeeId = req.query.employee;  // Obtener el ID del empleado de la URL
      const employee = await searchModel.getEmployeeById(employeeId);  // Obtener los detalles del empleado
      if (!employee) {
        return res.status(404).send('Employee not found');
      }
      employee.initial = employee.nombre.charAt(0).toUpperCase();
      console.log('Empleado encontrado:', employee);
      // Pasar los datos del empleado a la vista
      res.render('pages/interview', { employee });
    } catch (error) {
      console.error('Error al obtener los detalles del empleado:', error);
      res.status(500).send('Error al obtener los detalles del empleado');
    }
  };