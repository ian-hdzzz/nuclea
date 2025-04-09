const Holiday = require('../models/holiday.model');

exports.get_Holiday = (req, res) => {
    const mensaje = req.session.info || '';
    if (req.session.info) {
        req.session.info = '';
    }

    const mensajeerror = req.session.errorHOLI || '';
    if (req.session.errorHOLI) {
      req.session.errorHOLI = '';
    }
    Holiday.fetchAll()
      .then(([rows, fieldData]) => {
        if(rows.length>0){
          res.render('../views/pages/holiday.hbs', { 
            datosh: rows,
            csrfToken: req.csrfToken(),
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

exports.post_agregar_holiday = (request, response, next) => {
    console.log(request.body);
    const { Nombre_holiday, fecha } = request.body;

    if (!Nombre_holiday || !fecha) {
        console.error('Error: Falta Nombre_holiday o fecha.');
        return response.status(400).send('Datos inválidos');
    }

    const holiday = new Holiday(Nombre_holiday, fecha);

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
exports.get_delete = (req, res, next) => {
  console.log(req.body)
  Holiday.deleteA(req.params.idDiaFeriado).then(()=>{
      res.redirect('/nuclea/holiday')
  }).catch((error)=>{
      console.log(error)
  })
};

exports.get_update = (req, res, next) => {
  Holiday.fetchALL()
      .then(([dias, fD]) => {
          Holiday.fetchFAI(req.params.idDiaFeriado)
              .then(([dia, fD]) => {
                  const nodias = dias.length === 0;

                  res.render('../views/pages/editarFalta.hbs', {
                      csrfToken: req.csrfToken(),
                      faltass: dias,
                      falta: dia[0],
                      noFaltas: nodias,
                      title: 'Administrative offenses'
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

exports.post_update = (req, res, next) => {
  const idDia = req.params.idDiaFeriado;  // Usar el parámetro de la URL
  console.log(idDia)
  const { Nombre_holiday, fecha } = req.body;
  Holiday.Update(idDia, Nombre_holiday, fecha)
      .then(() => {
          req.session.info = `Addministrative offense updated.`;
          res.redirect('/nuclea/faltasAdministrativas');
      })
      .catch((error) => {
          req.session.errorAO = `Error registering Addministrative offense.`;
          res.redirect('/nuclea/faltasAdministrativas');
          res.status(500);
      });
};

exports.get_search_holiday = (req, res) => {
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