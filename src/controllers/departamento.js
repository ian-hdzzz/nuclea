const Departament = require('../models/departament.model');

exports.getDepartaments = (req, res) => {
    Departament.fetchAll()
      .then(([rows, fieldData]) => {
        res.render('../views/pages/departament.hbs', { datos: rows });
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        res.status(500).send('Internal Server Error');
      });
  };