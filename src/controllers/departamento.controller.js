const Departament = require('../models/departament.model');
const Empresa = require('../models/empresa.model');


exports.getDepartaments = (req, res) => {
  const mensaje = req.session.info || null;
  const error = req.session.error || null;
  req.session.info = null;
  Empresa.fetchAll()
    .then(([emp]) => {
      Departament.fetchAll()
        .then(([rows]) => {
          Departament.fetchAllDepa()
            .then(([rowsDepa]) => {
              if (rows.length > 0) {
                res.render('../views/pages/departament.hbs', { 
                  info: mensaje,
                  error: error,
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

        
    

exports.post_agregar_dep = (req, res, next) => {
    console.log(req.body);

    const empresaId = req.body.company ?? null;
    
    // Crear el nuevo departamento
    const falta = new Departament(
        req.body.Nombre_departamento,
        req.body.Descripcion,
        req.body.Estado
    );

    falta.save()
        .then(([result]) => {
            let depaId = result.insertId;
            console.log("ID del departamento insertado:", depaId);

            // Asignar el departamento a la empresa
            const asignacion = new Departament(
                null, null, null, depaId, empresaId
            );

            return asignacion.assign();
        })
        .then(() => {
          req.session.info = "Departament saved successfully";
          res.redirect('/nuclea/departament');
        })
        .catch((error) => {
            req.session.error = "Faild to save departament";
            console.log(error);
            res.status(500).send("Error al agregar el departamento.");
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
  Empresa.fetchAll().then(([emp]) => {
    Departament.fetchAll().then(([rows])=>{
      Departament.fetchAllDepa().then(([rowsDepa])=>{
        Departament.fetchFAI(req.params.idDepartamento)
      .then(([depas]) => {
  
                  res.render('../views/pages/editarDep.hbs', {
                      csrfToken: req.csrfToken(),
                      emp:emp,
                      depa:rows,
                      datos: depas[0],
                      emps:rowsDepa,
                      title: 'Administrative offenses'
                  });
                  console.log(depas)
              })
              .catch((err) => {
                  console.error('Error fetching Users:', err);
                  res.status(500).send('Internal Server Error');
              });
      })
    })
  })
  
};


exports.post_update = (req, res, next) => {
  const idDepartamento = req.params.idDepartamento;
  const nombre = req.body.Nombre_departamento || null;
  const descripcion = req.body.Descripcion || null;
  const estado = req.body.Estado || null;
  const idEmpresa = req.body.company || null; // Obtener el id de la empresa desde el formulario

  console.log("Valores enviados a Update:", { idDepartamento, nombre,descripcion, estado,idEmpresa});

  Departament.Update(idDepartamento, nombre,descripcion, estado, idEmpresa)
      .then(() => {
          res.redirect('/nuclea/departament');
      })
      .catch((error) => {
          console.error("Error al actualizar:", error);
          res.status(500).send("Error actualizando");
      });
};



exports.searchDepartments = (req, res) => {
  const searchTerm = req.query.name || '';
  
  Departament.searchByName(searchTerm)
      .then(([results]) => {
          res.json(results);
      })
      .catch(error => {
          console.error('Error en búsqueda:', error);
          res.status(500).json({ error: 'Error al buscar departamentos' });
      });
};
