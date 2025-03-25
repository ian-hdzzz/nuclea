const Request = require('../models/request.model');

exports.getRequests = (req, res) => {
  Request.fetchAll()
    .then(([rows]) => {
      res.render('pages/request', {
        datos: rows,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      console.error('Error al cargar las solicitudes:', err);
      res.status(500).send('Error al obtener los datos');
    });
};
