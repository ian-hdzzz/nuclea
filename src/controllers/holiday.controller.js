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
          req.session.errorHOLI = `Error registering Holiday.`;
          res.redirect('/nuclea/holiday');
          res.status(500);
        });
};
