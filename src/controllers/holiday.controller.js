const Holiday = require('../models/holiday.model');

exports.getHoliday = (req, res) => {
    const mensaje = req.session.info || '';
    if (req.session.info) {
        req.session.info = '';
    }

    const mensajeerror = req.session.errorHoli || '';
    if (req.session.errorHoli) {
      req.session.errorHoli = '';
    }
    Holiday.fetchAll()
      .then(([rows]) => {
        if(rows.length>0){
          res.render('../views/pages/holiday.hbs', { 
            datosh: rows,
            csrfToken: req.csrfToken(),
            error: mensajeerror,
            info: mensaje,
            title: 'Holidays',
        });
        }
        else{
          const error = req.session.error || true;
          req.session.error = false;
          res.render('../views/pages/holiday.hbs', { 
            datosh: rows,
            csrfToken: req.csrfToken(),
            error:error,
            info: mensaje,
            merror: mensajeerror,
        });
        }
        
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        res.status(500).send('Internal Server Error');
      });
  };

exports.postAgregarHoliday = (request, response, next) => {
    console.log(request.body);
    const { nombreHoliday, fecha } = request.body;

    if (!nombreHoliday || !fecha) {
        console.error('Error: Falta Nombre_holiday o fecha.');
        return response.status(400).send('Datos inválidos');
    }

    const holiday = new Holiday(nombreHoliday, fecha);

    holiday.save()
        .then(() => {
          request.session.info = `Holiday saved correctly.`;
          response.redirect('/nuclea/holiday')})
        .catch((error) => {
          request.session.errorHOLI = `Error registering Holiday.`;
          response.redirect('/nuclea/holiday');
          response.status(500);
        });



};
exports.deleteDelete = (req, res, next) => {
  const mensaje = req.session.info || '';
  if (req.session.info) {
      req.session.info = '';
  }

  const mensajeerror = req.session.errorHoli || '';
  if (req.session.errorHoli) {
    req.session.errorHoli = '';
  }
  Holiday.delete(req.params.idDiaFeriado).then(()=>{
    console.log("Solicitud eliminada correctamente");


    Holiday.fetchAll()
      .then(([rows]) => {
        if(rows.length>0){
          res.status(200).json({ 
            datosh: rows,
            csrfToken: req.csrfToken(),
            error: mensajeerror,
            info: mensaje,
            title: 'Holidays',
        });
        }
        else{
          const error = req.session.error || true;
          req.session.error = false;
          res.status(200).json({ 
            datosh: rows,
            csrfToken: req.csrfToken(),
            error:error,
            info: mensaje,
            merror: mensajeerror,
        });
        }
        
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        res.status(500).send('Internal Server Error');
      });

    })
    .catch((err) => {
      console.error('Error al eliminar la solicitud o cargar datos:', err);
      res.status(500).send('Error al procesar la solicitud');
    }); 
  
};

exports.getUpdate = (req, res, next) => {
  Holiday.fetchAll()
      .then(([dias]) => {
          Holiday.fetchOne(req.params.idDiaFeriado)
              .then(([dia]) => {
                  const nodias = dias.length === 0;

                  res.render('../views/pages/editarholiday.hbs', {
                      csrfToken: req.csrfToken(),
                      datosh: dias,
                      diai: dia[0],
                      noFaltas: nodias,
                      title: 'Holidays'
                  });
                  console.log(dia)
                      
              })
              .catch((err) => {
                  console.error('Error fetching Holiday individual:', err);
                  res.status(500).send('Internal Server Error');
              });
      }).catch((err) => {
          console.error('Error fetching Holidays:', err);
          res.status(500).send('Internal Server Error');
      });
}

exports.postUpdate = (req, res, next) => {
  const idDia = req.params.idDiaFeriado;  // Usar el parámetro de la URL
  console.log(idDia)
  const { Nombre_holiday, fecha } = req.body;
  Holiday.Update(idDia, Nombre_holiday, fecha)
      .then(() => {
          req.session.info = `Holiday updated correctly.`;
          res.redirect('/nuclea/holiday');
      })
      .catch((error) => {
          req.session.errorAO = `Error updating holiday.`;
          res.redirect('/nuclea/holiday');
          res.status(500);
      });
};

exports.getSearchHoliday = (req, res) => {
  const name = req.query.name || ''; 

  Holiday.search(name)
      .then(([rows]) => {
          res.json(rows); // Siempre devuelve JSON
      })
      .catch((error) => {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      });
};