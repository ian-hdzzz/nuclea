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

exports.get_delete = (req, res, next) => {
  console.log(req.body)
  Company.deleteA(req.params.idEmpresa).then(()=>{
      res.redirect('/nuclea/company')
  }).catch((error)=>{
      console.log(error)
  })
};


exports.get_update = (req, res, next) => {
  Company.fetchAll()
      .then(([companies, fD]) => {
          Company.fetchOne(req.params.idDiaFeriado)
              .then(([comp, fD]) => {
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

exports.post_update = (req, res, next) => {
  const idEmp = req.params.idEmpresa;  // Usar el parámetro de la URL
  console.log(idEmp)
  const { Nombre_emp, estatus_emp } = req.body;
  Company.Update(idEmp, Nombre_emp, estatus_emp)
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