const db = require('../util/database');
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

exports.postRequest = async (req, res) => {
  try {
    const { Nombre, Apellido, Tipo, Fecha_inicio, Fecha_fin, Descripcion } = req.body;

    const [[usuario]] = await db.execute(
      'SELECT idUsuario FROM Usuarios WHERE Nombre = ? AND Apellido = ?',
      [Nombre, Apellido]
    );

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }

    await db.execute(
      `INSERT INTO Solicitudes (idUsuario, Tipo, Fecha_inicio, Fecha_fin, Descripcion, Aprobacion_L, Aprobacion_A)
       VALUES (?, ?, ?, ?, ?, 'Pendiente', 'Pendiente')`,
      [usuario.idUsuario, Tipo, Fecha_inicio, Fecha_fin, Descripcion]
    );

    res.redirect('/nuclea/request');
  } catch (err) {
    console.error('Error al insertar la solicitud:', err);
    res.status(500).send('Error al insertar la solicitud');
  }
};
