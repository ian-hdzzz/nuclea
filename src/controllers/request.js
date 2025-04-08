const db = require('../util/database');
const Request = require('../models/request.model');
const DiasFeriados = require('../models/diasferiados.model');
const Usuario = require('../models/usuario.model');

exports.getRequests = (req, res) => {
  const mensaje = req.session.info || '';
     if (req.session.info) {
         req.session.info = '';
     }

     const mensajeerror = req.session.errorRE || '';
     if (req.session.errorRE) {
        req.session.errorRE = '';
     }
  DiasFeriados.fetchAll()
  .then(([diasf,fD]) => {
    let canViewPersonal = false;
    let canApprove = false; //Variable verificar si usuario puede aprobar solicitudes
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
          res.render('pages/request', {
            datos: rows,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Request',
            diasferiados: diasf,
            info: mensaje,
            error: mensajeerror,
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
          title: 'Request',
          diasferiados: diasf,
          info: mensaje,
          error: mensajeerror,
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

exports.postRequest = (request, response,next) => {
  
  const sessionId = request.session.idUsuario; // Definir antes de usar
  console.log(`Id: ${sessionId}`)
  const nombreUsuario = request.session.nombre; // Para mostrar en el mensaje

  const requests = new Request(sessionId, request.body.Tipo, request.body.Fecha_inicio, request.body.Fecha_fin,request.body.Descripcion);
  
  if(request.body.Tipo==='Vacations'){
    const fechaInicio = new Date(request.body.Fecha_inicio);
    const fechaFin = new Date(request.body.Fecha_fin);

    // Calcular la diferencia en milisegundos y convertirla a días
    const totalDias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24) + 1; // +1 para incluir ambos días

    Request.fetchDays(sessionId).then(([diasrestantes, FB])=>{
      const dias_restantes=diasrestantes[0].dias_vaciones;
      console.log(dias_restantes);
      const dias = dias_restantes-totalDias
      if(dias>=0){
        requests.save()
        .then(() => {
          request.session.info = `Request from ${nombreUsuario} saved.`;
          response.redirect('/nuclea/request/personal');
          console.log('Se guardó correctamente');            
        })
        .catch((err) => {
          request.session.errorRE = `Error registering request.`;
          console.error(err);
          response.redirect('/nuclea/request/personal');
          response.status(500);
        });
      }else {
        request.session.errorRE = `Could not register request, vacation days left ${dias_restantes}`;
        response.redirect('/nuclea/request/personal');
      }
    }).catch((err)=> {
      reqquest.session.errorRE = `Error registering request.`;
      console.error(err);
      response.redirect('/nuclea/request/personal');
      response.status(500);
    });

  }else{
    requests.save()
  
    .then(() => {
        request.session.info = `Solicitud de ${nombreUsuario} guardado.`;
        response.redirect('/nuclea/request/personal');
    })
    .catch((err) => {
      console.error('Error al guardar la solicitud:', err.message);
      console.error(err);
      response.status(500).send('Error al obtener los datos');
    });
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
    .then(() => res.redirect('/nuclea/request/approval'))
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
      if (!rol) return res.status(403).send('Rol no encontrado');

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
  const { Tipo, Fecha_inicio, Fecha_fin, Descripcion } = req.body;

  db.execute(`
    UPDATE Solicitudes
    SET Tipo = ?, Fecha_inicio = ?, Fecha_fin = ?, Descripcion = ?,
        Aprobacion_L = 'Pendiente', Fecha_aprob_L = NULL,
        Aprobacion_A = 'Pendiente', Fecha_aprob_A = NULL
    WHERE idSolicitud = ?
  `, [Tipo, Fecha_inicio, Fecha_fin, Descripcion, idSolicitud])
    .then(() => {
      res.redirect('/nuclea/request/personal');
    })
    .catch(err => {
      console.error('Error al editar la solicitud:', err);
      res.status(500).send('Error interno');
    });
};

/* 

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

  let encontrado = false; // Variable para saber si encontramos el privilegio 'addAO'
  console.log('privilegios session', req.session.privilegios);
  let privilegiostot = req.session.privilegios;
  console.log(privilegiostot);

  for (let privilegio of privilegiostot) {
    if (privilegio.Nombre_privilegio == 'viewcollabs') {
      DiasFeriados.fetchAll()
        .then(([diasf, fD]) => {
          Request.requestcollabs(req.session.idUsuario)
            .then(([rows]) => {
              res.render('pages/requestadmin', {
                datos: rows,
                csrfToken: req.csrfToken(),
                sessionId: req.session.idUsuario,
                nombreUsuario: req.session.nombre,
                apellidosUsuario: req.session.apellidos,
                title: 'Request',
                diasferiados: diasf,
                puedeAceptar: true
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
    .then(([diasf, fD]) => {
      Request.fetchAll()
        .then(([rows]) => {
          res.render('pages/requestadmin', {
            datos: rows,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Request',
            diasferiados: diasf,
            puedeAceptar: true
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
  for (let privilegio of req.session.privilegios) {

    if (privilegio.Nombre_privilegio == 'Acepta Deniega solicitud'){
      canApprove = true;
    }

  DiasFeriados.fetchAll()
    .then(([diasf, fD]) => {
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
            puedeAceptar: canApprove
          });
        })
        .catch((err) => {
          console.error('Error al cargar las solicitudes:', err);
          res.status(500).send('Error al obtener los datos');
        });
    })
    .catch((err) => {
      console.error('Error fetching the holidays:', err);
      res.status(500).send('Internal Server Error');
    });
}};
