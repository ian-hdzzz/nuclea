const Departament = require('../models/departament.model');

exports.getDepartaments = (req, res) => {
    Departament.fetchAll()
      .then(([rows, fieldData]) => {
        if(rows.length>0){
          res.render('../views/pages/departament.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
            title: 'Departaments',
        });
        }
        else{
          const error = req.session.error || true;
          req.session.error = false;
          res.render('../views/pages/departament.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
            error:error,
        });
        }
        
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

