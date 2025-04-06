const Company = require('../models/empresa.model');

/**
 * Renderiza la página de holidays con los datos de empresas.
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.get_company = (req, res) => {
  const mensaje = req.session.info || '';
  if (req.session.info) {
    req.session.info = '';
  }

  const mensajeerror = req.session.errorCO || '';
  if (req.session.errorCO) {
    req.session.errorCO = '';
  }
  
  Company.fetchAll()
      .then(([empresas, fieldData]) => {
        if (empresas.length > 0) {
          res.render('../views/pages/company.hbs', {
            datosh: empresas,
            csrfToken: req.csrfToken(),
            title: 'Companies',
            info: mensaje,
            merror: mensajeerror,
          });
        } else {
          const error = req.session.error || true;
          req.session.error = false;
          res.render('../views/pages/company.hbs', {
            datosh: empresas,
            csrfToken: req.csrfToken(),
            error: error,
            info: mensaje,
            merror: mensajeerror,
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        res.status(500).send('Internal Server Error');
      });
};

/**
 * Maneja el envío del formulario para crear una nueva empresa.
 * @param {Object} request - Objeto de solicitud Express
 * @param {Object} response - Objeto de respuesta Express
 * @param {Function} next - Función middleware next de Express
 */
exports.post_agregar_company = (request, response, next) => {
  console.log(request.body);
  const company = new Company(request.body.Nombre_company, request.body.status_company);

  company.save()
      .then(() => {
        request.session.info = 'Company saved correctly.';
        response.redirect('/nuclea/company');
      })
      .catch((error) => {
        request.session.errorCO = 'Error registering Company.';
        response.redirect('/nuclea/company');
        response.status(500);
      });
};