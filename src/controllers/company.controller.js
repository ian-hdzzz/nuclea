const Company = require('../models/holiday.model');

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
            title: 'Holidays',
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
  const {Coname, Coestado} = request.body;

  if (!Coname || !Coestado) {
    console.error('Error: al enviar el formulario.');
    return response.status(400).send('Datos inválidos');
  }

  const company = new Company(Coname, Coestado);

  company.save()
      .then(() => {
        request.session.info = 'Company saved correctly.';
        response.redirect('/nuclea/holiday');
      })
      .catch((error) => {
        request.session.errorCO = 'Error registering Company.';
        request.redirect('/nuclea/holiday');
        request.status(500);
      });
};