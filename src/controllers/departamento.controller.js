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
                  title: 'Departments',
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

        
    

exports.postAgregarDep = (req, res, next) => {
    console.log(req.body);

    const empresaId = req.body.company ?? null;
    
    // Crear el nuevo departamento
    const falta = new Departament(
        req.body.nombreDepartamento,
        req.body.descripcion,
        req.body.estado
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

// controllers/departamento.controller.js
exports.delete = (req, res, next) => {
  const id = req.params.idDepartamento;
  Departament.deleteA(id)
    .then(() => Departament.fetchAllDepa())
    .then(([rows]) => {
      res.status(200).json({ 
        success: true, 
        datos: rows.map(row => ({
          idDepartamento: row.idDepartamento,
          Nombre_departamento: row.Nombre_departamento, // Nombre correcto
          Descripcion: row.Descripcion,
          Estado: row.Estado,
          Nombre_empresa: row.Nombre_empresa // Nombre correcto
        }))
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al eliminar' });
    });
};

exports.getUpdate = (req, res, next) => {
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
                      title: 'Departments',
                      iconClass: 'fa-solid fa-building',
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


exports.postUpdate = (req, res, next) => {
  const idDepartamento = req.params.idDepartamento;
  const nombre = req.body.nombreDepartamento || null;
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
