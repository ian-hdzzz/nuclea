const Departament = require('../models/departament.model');

exports.getDepartaments = (req, res) => {
    Departament.fetchAll()
      .then(([rows, fieldData]) => {
        res.render('../views/pages/departament.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
            title: 'Departaments',
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
            response.redirect('/nuclea/departament');
        })
        .catch((error) => {
            console.log(error);
        });
};

