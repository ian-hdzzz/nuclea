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
  Falta.fetchFA()
      .then(([faltas, fD]) => {
          Falta.fetchFAI(req.params.idFalta)
              .then(([falta, fD]) => {
                  Usuario.fetchAll()
                      .then(([rows, fieldData]) => {
                          const noFaltas = faltas.length === 0;

                          res.render('../views/pages/editarFalta.hbs', {
                              usuariosfa: rows,
                              csrfToken: req.csrfToken(),
                              faltass: faltas,
                              falta: falta[0],
                              noFaltas: noFaltas,
                              title: 'Administrative offenses'
                          });
                          console.log(falta)
                      })
                      .catch((err) => {
                          console.error('Error fetching Users:', err);
                          res.status(500).send('Internal Server Error');
                      });
              })
              .catch((err) => {
                  console.error('Error fetching Administrative offenses:', err);
                  res.status(500).send('Internal Server Error');
              });
      }).catch((err) => {
          console.error('Error fetching Administrative offenses:', err);
          res.status(500).send('Internal Server Error');
      });
}

exports.post_update = (req, res, next) => {
  const idFalta = req.params.idFalta;  // Usar el parámetro de la URL
  console.log(idFalta)
  const archivo = req.file ? req.file.filename : req.body.archivoActual;  // Conservar archivo actual si no hay nuevo

  Falta.Update(idFalta, req.body.idUsu, req.body.fecha, req.body.motivo, archivo)
      .then(() => {
          req.session.info = `Addministrative offense updated.`;
          res.redirect('/nuclea/faltasAdministrativas');
      })
      .catch((error) => {
          req.session.errorAO = `Error registering Addministrative offense.`;
          res.redirect('/nuclea/faltasAdministrativas');
          res.status(500);
      });
};