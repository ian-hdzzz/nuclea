const Company = require('../models/empresa.model');

/**
 * Renderiza la página de holidays con los datos de empresas.
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getCompany = (req, res) => {
  const mensaje = req.session.info || '';
  if (req.session.info) {
    req.session.info = '';
  }

  const mensajeerror = req.session.errorCo || '';
  if (req.session.errorCo) {
    req.session.errorCo = '';
  }
  
  Company.fetchAll()
      .then(([empresas]) => {
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
exports.postAgregarCompany = (request, response, next) => {
  console.log(request.body);
  const company = new Company(request.body.nombreCompany, request.body.statusCompany);

  company.save()
      .then(() => {
        request.session.info = 'Company saved correctly.';
        response.redirect('/nuclea/company');
      })
      .catch((error) => {
        request.session.errorCo = 'Error registering Company.';
        response.redirect('/nuclea/company');
        response.status(500);
      });

};

exports.getDelete = (req, res, next) => {
  console.log(req.body)
  Company.deleteA(req.params.idEmpresa).then(()=>{
      res.redirect('/nuclea/company')
  }).catch((error)=>{
      console.log(error)
  })
};


exports.getUpdate = (req, res, next) => {
  Company.fetchAll()
      .then(([companies]) => {
          Company.fetchOne(req.params.idEmpresa)
              .then(([comp]) => {
                  const nodias = companies.length === 0;
                  res.render('../views/pages/editarcompany.hbs', {
                      csrfToken: req.csrfToken(),
                      datosh: companies,
                      comp: comp[0],
                      noFaltas: nodias,
                      title: 'Companies'
                  });
                  console.log(comp)
                      
              })
              .catch((err) => {
                  console.error('Error fetching individual company:', err);
                  res.status(500).send('Internal Server Error');
              });
      }).catch((err) => {
          console.error('Error fetching companies:', err);
          res.status(500).send('Internal Server Error');
      });
}

exports.postUpdate = (req, res, next) => {
  const idEmp = req.params.idEmpresa;  // Usar el parámetro de la URL
  console.log(idEmp)
  const {  nombreCompany, statusCompany } = req.body;
  Company.Update(idEmp, nombreCompany, statusCompany)
      .then(() => {
          req.session.info = `Company updated correctly.`;
          res.redirect('/nuclea/company');
      })
      .catch((error) => {
          req.session.errorAO = `Error updating Company.`;
          res.redirect('/nuclea/company');
          res.status(500);
      });
};