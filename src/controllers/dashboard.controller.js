const Request = require('../models/request.model');
exports.getDashboard = (req, res) => {
    Request.fetchDays(req.session.idUsuario)
    .then(([rows])=>
        res.render('pages/dashboard',{
            title:'Dashboard', 
            iconClass:'fa-solid fa-house', 
            currentPath: req.path,
            dias_restantes: rows[0].dias_vaciones
        }));

};