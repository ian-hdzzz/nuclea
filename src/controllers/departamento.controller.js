const Departament = require('../models/departament.model');
const Empresa = require('../models/empresa.model');
const { asign } = require('../models/role.model');

exports.getDepartaments = (req, res) => {
  Empresa.fetchAll()
    .then(([emp, fieldData]) => {
      Departament.fetchAll()
        .then(([rows, fieldData]) => {
          Departament.fetchAllDepa()
            .then(([rowsDepa, fieldData]) => {
              if (rows.length > 0) {
                res.render('../views/pages/departament.hbs', { 
                  datos: rowsDepa,
                  emps: emp,
                  csrfToken: req.csrfToken(),
                  title: 'Departaments',
                  iconClass: 'fa-solid fa-building',
                });
              } else {
                const error = req.session.error || true;
                req.session.error = false;
                res.render('../views/pages/departament.hbs', { 
                  datos: rows,
                  csrfToken: req.csrfToken(),
                  error: error,
                });
              }
            })
            .catch((err) => {
              console.error('Error fetching departments:', err);
              res.status(500).send('Internal Server Error');
            });
        })
        .catch((err) => {
          console.error('Error fetching departments:', err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch((err) => {
      console.error('Error fetching companies:', err);
      res.status(500).send('Internal Server Error');
    });
};

        
    

exports.post_agregar_dep = (request, response, next) => {
    console.log(request.body);

    const empresaId = request.body.company ?? null;
    
    // Crear el nuevo departamento
    const falta = new Departament(
        request.body.Nombre_departamento,
        request.body.Descripcion,
        request.body.Estado
    );

    falta.save()
        .then(([result]) => {
            let depaId = result.insertId;

            // Asignar el departamento a la empresa
            const asignacion = new Departament(
                null, null, null, depaId, empresaId
            );

            return asignacion.assign();
        })
        .then(() => {
            response.redirect('/nuclea/departament');
        })
        .catch((error) => {
            console.log(error);
            response.status(500).send("Error al agregar el departamento.");
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
  Departament.fetchFAI(req.params.idDepartamento)
      .then(([depas, fD]) => {
  
                  res.render('../views/pages/editarDep.hbs', {
                      csrfToken: req.csrfToken(),
                      datos: depas[0],
                      title: 'Administrative offenses'
                  });
                  console.log(depas)
              })
              .catch((err) => {
                  console.error('Error fetching Users:', err);
                  res.status(500).send('Internal Server Error');
              });
      };


exports.post_update = (req, res, next) => {
  const idDepartamento = req.params.idDepartamento;
  const nombre = req.body.Nombre_departamento || null;
  const descripcion = req.body.Descripcion || null;
  const estado = req.body.Estado || null;

  console.log("Valores enviados a Update:", { idDepartamento, nombre,descripcion, estado });

  Departament.Update(idDepartamento, nombre,descripcion, estado)
      .then(() => {
          res.redirect('/nuclea/departament');
      })
      .catch((error) => {
          console.error("Error al actualizar:", error);
          res.status(500).send("Error actualizando");
      });
};