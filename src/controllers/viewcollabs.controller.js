const Usuario = require('../models/usuario.model');

exports.getDepartaments = (req, res) => {
    Departament.fetchAll()
      .then(([rows, fieldData]) => {
        if(rows.length>0){
          res.render('../views/pages/viewCollabs.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
            title: 'View Department Collaborators',
            iconClass: 'fa-solid fa-building',
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