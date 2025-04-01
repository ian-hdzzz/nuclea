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

exports.get_delete = (req, res, next) => {
  console.log(req.body)
  Departament.deleteA(req.params.idDepartamento).then(()=>{
      res.redirect('/nuclea/departament')
  }).catch((error)=>{
      console.log(error)
  })
};

exports.get_update = (req, res, next) => {
  Falta.fetchFAI(req.params.idFalta)
      .then(([faltas, fD]) => {
          Usuario.fetchAll()
              .then(([rows, fieldData]) => {
                  const noFaltas = faltas.length === 0;

                  res.render('../views/pages/editarFalta.hbs', {
                      usuariosfa: rows,
                      csrfToken: req.csrfToken(),
                      falta: faltas[0],
                      noFaltas: noFaltas,
                      title: 'Administrative offenses'
                  });
                  console.log(faltas)
              })
              .catch((err) => {
                  console.error('Error fetching Users:', err);
                  res.status(500).send('Internal Server Error');
              });
      })
      .catch((err) => {
          console.error('Error fetching Administrative offenses:', err);
          res.status(500).send('Internal Server Error');
      });
}

exports.post_update = (req, res, next) => {
  const idFalta = req.params.idFalta;
  const idUsuario = req.body.idUsu || null;
  const fecha = req.body.fecha || null;
  const motivo = req.body.motivo || null;
  const archivo = req.file?.filename ?? req.body.archivoActual ?? null;

  console.log("Valores enviados a Update:", { idFalta, idUsuario, fecha, motivo, archivo });

  Falta.Update(idFalta, idUsuario, fecha, motivo, archivo)
      .then(() => {
          res.redirect('/nuclea/faltasAdministrativas');
      })
      .catch((error) => {
          console.error("Error al actualizar:", error);
          res.status(500).send("Error actualizando");
      });
};