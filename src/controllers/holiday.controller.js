const Holiday = require('../models/holiday.model');

exports.get_Holiday = (req, res) => {
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
        .then(() => response.redirect('/nuclea/holiday'))
        .catch((error) => console.error('Error al guardar holiday:', error));
};
