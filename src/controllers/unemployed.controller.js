const Usuario = require('../models/unemployed.model');

exports.getUnemployedUsers = (req, res) => {
  const privilegios = req.session.privilegios || [];

  const tieneAcceso = privilegios.some(
    (p) => p.Nombre_privilegio === 'viewreport'
  );

  if (!tieneAcceso) {
    req.session.errorRe = 'Acceso denegado: no cuentas con el privilegio necesario.';
    return res.redirect('/nuclea/request/personal');
  }

  Usuario.fetchUnemployedUsers()
    .then(([users]) => {
      res.render('pages/unemployed', {
        usuarios: users,
        title: 'Unemployed Users',
        nombreUsuario: req.session.nombre,
        apellidosUsuario: req.session.apellidos
      });
    })
    .catch((error) => {
      console.error('Error al obtener usuarios inactivos:', error);
      res.status(500).send('Error interno al cargar usuarios inactivos.');
    });
};
