const db = require('../util/database');
const Request = require('../models/request.model');
const DiasFeriados = require('../models/diasferiados.model');

exports.getRequests = (req, res) => {
  DiasFeriados.fetchAll()
    .then(([diasf,fD]) => {
      Request.fetchAll()
        .then(([rows]) => {
          res.render('pages/request', {
            datos: rows,
            csrfToken: req.csrfToken(),
            sessionId: req.session.idUsuario,
            nombreUsuario: req.session.nombre,
            apellidosUsuario: req.session.apellidos,
            title: 'Vacational Requests',
            diasferiados: diasf,
            iconClass: 'fa-solid fa-plane-up'
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
          request.session.info = `Solicitud de ${nombreUsuario} guardado.`;
          response.redirect('/nuclea/request');
          console.log('Se guardó correctamente');            
        })
        .catch((err) => {
          console.error('Error al guardar la solicitud:', err.message);
          console.error(err);
          response.status(500).send('Error al obtener los datos');
        });
      }else {
        console.log(`No se pudo guardar la solicitud, te quedan ${dias_restantes}`)
        response.redirect('/nuclea/request');
      }
    }).catch((err)=> {
      console.error('Error al guardar la solicitud:', err.message);
      console.error(err);
      response.status(500).send('Error al obtener los datos');
    });

  }else{
    requests.save()
  
    .then(() => {
        request.session.info = `Solicitud de ${nombreUsuario} guardado.`;
        response.redirect('/nuclea/request');
    })
    .catch((err) => {
      console.error('Error al guardar la solicitud:', err.message);
      console.error(err);
      response.status(500).send('Error al obtener los datos');
    });
  }
  

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