const Departament = require('../models/request.model');

exports.getDepartaments = (req, res) => {
    Departament.fetchAll()
      .then(([rows, fieldData]) => {
        res.render('../views/pages/request.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
        });
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        res.status(500).send('Internal Server Error');
      });
  };

  exports.post_agregar_dep = (request, response, next) => {
    console.log(request.body);
    console.log(request.body.fecha);
    const falta = new Departament(request.body.Nombre_departamento, request.body.Descripcion, request.body.Estado);
    falta.save()
        .then(() => {
            response.redirect('/nuclea/request');
        })
        .catch((error) => {
            console.log(error);
        });
};

