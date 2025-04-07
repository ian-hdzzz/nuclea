const Usuario = require('../models/usuario.model');

exports.getcollabsd = (req, res) => {
    const sessionId = req.session.idUsuario;
    console.log(sessionId)
    Usuario.getcollabsdept(sessionId)
      .then(([rows, fieldData]) => {
          const nousers = rows.length === 0;
          res.render('../views/pages/viewCollabs.hbs', { 
            datos: rows,
            csrfToken: req.csrfToken(),
            title: 'View Department Collaborators',
            noUsers : nousers,
            iconClass: 'fa fa-users',
        });
      })
      .catch((err) => {
        console.error('Error fetching dept collabs:', err);
        res.status(500).send('Internal Server Error');
      });
};