const db = require('../util/database');
const Request = require('../models/request.model');
const DiasFeriados = require('../models/diasferiados.model');
const Usuario = require('../models/usuario.model');
const helpers = require('../lib/helpers');

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
            title: 'Request',
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
          title: 'Request',
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

exports.postRequest = (request, response,next) => {
  
  const sessionId = request.session.idUsuario; // Definir antes de usar
  console.log(`Id: ${sessionId}`)
  const nombreUsuario = request.session.nombre; // Para mostrar en el mensaje

  const requests = new Request(sessionId, request.body.tipo, request.body.fechaInicio, request.body.fechaFin,request.body.descripcion);
  DiasFeriados.fetchBetween(request.body.fechaInicio,request.body.fechaFin)
    .then(([rows]) => {
      const feriados = rows[0]['COUNT(*)'];
      if(request.body.tipo==='Vacations'){
        //const feriados = DiasFeriados.fetchBetween(request.body.fechaInicio, request.body.fechaFin)
    
        const fechaInicio = new Date(request.body.fechaInicio);
        const fechaFin = new Date(request.body.fechaFin);  
        console.log(request.body.fechaInicio);
        console.log(request.body.fechaFin);
        // Calcular la diferencia en milisegundos y convertirla a días
        const totalDias = helpers.countWeekdays(fechaInicio, fechaFin); // Por ahora solo excluimos fines de semana. Luego restaremos feriados si es necesario.
        console.log('Weekdays entre fechas:', helpers.countWeekdays(fechaInicio, fechaFin));
        console.log(totalDias)
        Request.fetchDays(sessionId).then(([diasRestantes])=>{
          const diaRestantes=diasRestantes[0].dias_vaciones;
          console.log('Estos son los dias restantes:')
          console.log(diaRestantes);
          
          if(totalDias>0){
            const dias = diaRestantes-totalDias
            console.log('Estos son los dias restantes:')
            console.log(dias);
            if(dias>=0){
              requests.save()
              .then(() => {
                request.session.info = `Request from ${nombreUsuario} saved.`;
                response.redirect('/nuclea/request/personal');
                console.log('Se guardó correctamente');            
              })
              .catch((err) => {
                request.session.errorRe = `Error registering request.`;
                console.error(err);
                response.redirect('/nuclea/request/personal');
                response.status(500);
              });
            }else {
              request.session.errorRe = `Could not register request, vacation days left ${diaRestantes}`;
              response.redirect('/nuclea/request/personal');
            }
          }
        }).catch((err)=> {
          request.session.errorRe = `Error registering request.`;
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
    }).catch((err)=> {
      request.session.errorRe = `Error registering request.`;
      console.error(err);
      response.redirect('/nuclea/request/personal');
      response.status(500);
    });

  
  

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



