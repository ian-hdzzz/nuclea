const db = require('../util/database');
const Request = require('../models/request.model');
const DiasFeriados = require('../models/diasferiados.model');
const Usuario = require('../models/usuario.model');
const helpers = require('../lib/helpers');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

exports.getRequests = (req, res) => {
  const mensaje = req.session.info || '';
     if (req.session.info) {
         req.session.info = '';
     }

     const mensajeerror = req.session.errorRe || '';
     if (req.session.errorRe) {
        req.session.errorRe = '';
     }
  DiasFeriados.fetchAll()
  .then(([diasf]) => {
    let canViewPersonal = false;
    let canApprove = false; //Variable verificar si usuario puede aprobar solicitudes

    Usuario.getPrivilegios(req.session.idUsuario).then(([privilegios, fieldData]) => {
      req.session.privilegios = [];
      for(let privilegio of privilegios) {
          req.session.privilegios.push(privilegio);
      }
      console.log(req.session.privilegios);
    }).catch((error) => {
      console.log(error);
    });

    for (let privilegio of req.session.privilegios) {
  
      if (privilegio.Nombre_privilegio == 'Consultar solicitudes propias') {
        canViewPersonal = true;
      }
      if (privilegio.Nombre_privilegio == 'Acepta Deniega solicitud'){
        canApprove = true;
      }
      
      if (canViewPersonal) {
        Request.fetchPersonal(req.session.idUsuario)
        .then(([rows]) => {
          // Revisar cada solicitud y ajustar los campos si no son Vacations
            const processedRows = rows.map(row => {
              if (row.Tipo !== 'Vacations') {
                row.Aprobacion_L = 'NULL';
                row.Aprobacion_A = 'NULL';
              }
              return row;
              });
          res.render('pages/request', {
            datos: processedRows,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Vacation Requests',
            iconClass: 'fa-solid fa-plane-up',
            diasferiados: diasf,
            info: mensaje,
            error: mensajeerror,
            canApprove
          });
        })
        .catch((err)=>{
          console.error('Error al cargar las solicitudes:', err);
          res.status(500).send('Error al obtener los datos');
        })
      }
      
    }
    if(!canViewPersonal){
      Request.fetchPersonal(req.session.idUsuario)
      .then(([rows]) => {
        res.render('pages/request', {
          datos: rows,
          csrfToken: req.csrfToken(),
          sessionId: req.session.idUsuario,
          nombreUsuario: req.session.nombre,
          apellidosUsuario: req.session.apellidos,
          title: 'Vacation Requests',
          iconClass: 'fa-solid fa-plane-up',
          diasferiados: diasf,
          info: mensaje,
          error: mensajeerror,
          canApprove
        });
      })
      .catch((err) => {
        console.error('Error al cargar las solicitudes:', err);
        res.status(500).send('Error al obtener los datos');
      });

    }
  }).catch((err) => {
    console.error('Error fetching the holidays:', err);
    res.status(500).send('Internal Server Error');
  });
};

exports.postRequest = async (request, response, next) => {
  try {
    const sessionId = request.session.idUsuario;
    const nombreUsuario = request.session.nombre;
    const apellidoUsuario = request.session.apellidos;

    const { tipo, fechaInicio, fechaFin, descripcion } = request.body;

    const requests = new Request(sessionId, tipo, fechaInicio, fechaFin, descripcion);

    const [feriadoRows] = await DiasFeriados.fetchBetween(fechaInicio, fechaFin);
    const feriados = feriadoRows[0]['COUNT(*)'];
    
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    const totalWeekdays = helpers.countWeekdays(fechaInicioDate, fechaFinDate);
    const totalDias = totalWeekdays - feriados;

    if (tipo === 'Vacations') {
      if (totalDias <= 0) {
        request.session.errorRe = 'Vacation request must contain at least 1 valid weekday.';
        return response.redirect('/nuclea/request/personal');
      }

      const [[{ dias_vaciones }]] = await Request.fetchDays(sessionId);
      const diasRestantes = dias_vaciones;

      if (diasRestantes < totalDias) {
        request.session.errorRe = `Could not register request, vacation days left ${diasRestantes}`;
        return response.redirect('/nuclea/request/personal');
      }
    }

    await requests.save();
    request.session.info = `Request from ${nombreUsuario} saved.`;
    console.log('Solicitud guardada exitosamente.');

    const admins = await Usuario.fetchAdmins();
    const leaders = await Usuario.fetchLeader(sessionId);

    const correoAdmins = admins[0][0].Admins;
    const correoLideres = leaders[0][0].Lideres;

    console.log('Admins:', correoAdmins);
    console.log('Lideres:', correoLideres);

    console.log(correoAdmins)
    console.log(correoLideres)

    if (tipo === 'Vacations') {
      const correoHTML = `
        <h2>New Vacation Request Created</h2>
        <p>A vacation request has been submitted by ${nombreUsuario} ${apellidoUsuario}.</p>
        <ul>
          <li><strong>From:</strong> ${fechaInicio}</li>
          <li><strong>To:</strong> ${fechaFin}</li>
          <li><strong>Description:</strong> ${descripcion}</li>
        </ul>
        <p>Please review the request in the system and proceed with the corresponding action.</p>
        <p>Thank you!</p>
      `;

      if (correoAdmins) {
        console.log('enviando correo admins')
        await transporter.sendMail({
          from: '"Nuclea App" <flowitdb@gmail.com>',
          to: correoAdmins,
          subject: 'New Vacation Request Created',
          html: correoHTML,
        });
      }

      if (correoLideres) {
        console.log('enviando correo lideres')
        await transporter.sendMail({
          from: '"Nuclea App" <flowitdb@gmail.com>',
          to: correoLideres,
          subject: 'New Vacation Request Created',
          html: correoHTML,
        });
      }
    }

    response.redirect('/nuclea/request/personal');
  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    request.session.errorRe = 'Error registering request.';
    response.redirect('/nuclea/request/personal');
    response.status(500);
  }
};

exports.approveRequest = (req, res) => {
  const solicitudId = req.params.id;
  const usuarioId = req.session.idUsuario;

  Usuario.getRolById(usuarioId)
    .then(([result]) => {
      const rol = result[0]?.idRol;
      if (!rol) return res.status(403).send('Rol no encontrado');

      return Request.approveSolicitud(solicitudId, rol);
    })
    .then((rechazada) => {
      if (rechazada) {
        req.session.errorRe = 'Request rejected: not enough vacation days.';
    }
      res.redirect('/nuclea/request/approval');
    })
    .catch((err) => {
      console.error('Error al aprobar la solicitud:', err);
      res.status(500).send('Error interno');
    });
};

//Método para rechazar una solicitud
exports.rejectRequest = (req, res) => {
  const solicitudId = req.params.id;
  const usuarioId = req.session.idUsuario;

  Usuario.getRolById(usuarioId)
    .then(([result]) => {
      const rol = result[0]?.idRol;
      if (!rol) {
        return res.status(403).send('Rol no encontrado');
      }

      return Request.rejectSolicitud(solicitudId, rol);
    })
    .then(() => res.redirect('/nuclea/request/approval'))
    .catch((err) => {
      console.error('Error al rechazar la solicitud:', err);
      res.status(500).send('Error interno');
    });
};

exports.editRequest = (req, res) => {
  const idSolicitud = req.params.id;
  const { tipo, fechaInicio, fechaFin, descripcion } = req.body;

  db.execute(`
    UPDATE Solicitudes
    SET Tipo = ?, Fecha_inicio = ?, Fecha_fin = ?, Descripcion = ?,
        Aprobacion_L = 'Pendiente', Fecha_aprob_L = NULL,
        Aprobacion_A = 'Pendiente', Fecha_aprob_A = NULL
    WHERE idSolicitud = ?
  `, [tipo, fechaInicio, fechaFin, descripcion, idSolicitud])
    .then(() => {
      res.redirect('/nuclea/request/personal');
    })
    .catch(err => {
      console.error('Error al editar la solicitud:', err);
      res.status(500).send('Error interno');
    });
};

/** 

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
 */

exports.getRequestsapr = (req, res) => {
  // Verificamos si el usuario tiene el privilegio requerido
  const privilegios = req.session.privilegios || [];
  const puedeAceptar = privilegios.some(p => p.Nombre_privilegio === 'Acepta Deniega solicitud');

  if (!puedeAceptar) {
    return res.redirect('/nuclea/request/personal');
  }

  const mensajeerror = req.session.errorRe || ''; // ✅ Agregar esto
  if (req.session.errorRe) {
    req.session.errorRe = '';
  }

  let encontrado = false; // Variable para saber si encontramos el privilegio 'addAO'
  console.log('privilegios session', req.session.privilegios);
  let privilegiosTot = req.session.privilegios;
  console.log(privilegiosTot);

  for (let privilegio of privilegiosTot) {
    if (privilegio.Nombre_privilegio == 'viewcollabs') {
      DiasFeriados.fetchAll()
        .then(([diasf]) => {
          Request.requestcollabs(req.session.idUsuario)
            .then(([rows]) => {
              const vacationRequests = rows.filter(row => row.Tipo === 'Vacations'); //Filtrar solo por vacaciones
              res.render('pages/requestadmin', {
                datos: vacationRequests,
                csrfToken: req.csrfToken(),
                sessionId: req.session.idUsuario,
                nombreUsuario: req.session.nombre,
                apellidosUsuario: req.session.apellidos,
                title: 'Request',
                diasferiados: diasf,
                puedeAceptar: true,
                error: mensajeerror
              });
            })
            .catch((err) => {
              console.error('Error al cargar las solicitudes:', err);
              res.status(500).send('Error al obtener los datos');
            });
        }).catch((err) => {
          console.error('Error fetching the holidays:', err);
          res.status(500).send('Internal Server Error');
        });
      return;
    }
  };

  DiasFeriados.fetchAll()
    .then(([diasf]) => {
      Request.fetchAll()
        .then(([rows]) => {
          const vacationRequests = rows.filter(row => row.Tipo === 'Vacations'); //Filtrar solo por vacaciones
          res.render('pages/requestadmin', {
            datos: vacationRequests,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Request',
            diasferiados: diasf,
            puedeAceptar: true,
            error: mensajeerror
          });
        })
        .catch((err) => {
          console.error('Error al cargar las solicitudes:', err);
          res.status(500).send('Error al obtener los datos');
        });
    }).catch((err) => {
      console.error('Error fetching the holidays:', err);
      res.status(500).send('Internal Server Error');
    });
};

exports.getRequestsPersonal = (req, res) => {
  const privilegios = req.session.privilegios || [];
  for (let privilegio of privilegios) {

    if (privilegio.Nombre_privilegio == 'Acepta Deniega solicitud'){
      canApprove = true;
    }

  DiasFeriados.fetchAll()
    .then(([diasf, ]) => {
      Request.fetchPersonal(req.session.idUsuario)
        .then(([rows]) => {
          res.render('pages/requestpersonal', {
            datos: rows,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Request',
            diasferiados: diasf,
          });
        })
        .catch((err) => {
          console.error('Error al cargar las solicitudes:', err);
          res.status(500).send('Error al obtener los datos');
        })
  }).catch((err) => {
    console.error('Error fetching the holidays:', err);
    res.status(500).send('Internal Server Error');
  });
}
};




exports.delete = (req, res) => {
  const mensaje = req.session.info || '';
     if (req.session.info) {
         req.session.info = '';
     }

     const mensajeerror = req.session.errorRe || '';
     if (req.session.errorRe) {
        req.session.errorRe = '';
     }
  Request.delete(req.params.idSolicitud).then(()=>{
    console.log("Solicitud eliminada correctamente");
    Request.fetchPersonal(req.session.idUsuario)
    .then(([rows]) => {
      res.status(200).json({
        datos: rows,
        csrfToken: req.csrfToken(),
        sessionId: req.session.idUsuario,
        nombreUsuario: req.session.nombre,
        apellidosUsuario: req.session.apellidos,
        title: 'Request',
        info: mensaje,
        error: mensajeerror,
      });
    })
    .catch((err)=>{
      console.error('Error al cargar las solicitudes:', err);
      res.status(500).send('Error al obtener los datos');
    })


  }).catch((err) => {
    console.error('Error al eliminar la solicitud o cargar datos:', err);
    res.status(500).send('Error al procesar la solicitud');
  }); 

};



