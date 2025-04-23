const Request = require('../models/request.model');
const Holiday = require('../models/holiday.model');
exports.getDashboard = async (req, res) => {
    try {
        const [asueto] = await Holiday.fetchtop3();
        const [[dias]] = await Request.fetchDays(req.session.idUsuario);
        const [[pendiente]] = await Request.countPendientesVacaciones(req.session.idUsuario);

        console.log('asueto sin stringify', asueto);
        console.log('asueto', JSON.stringify(asueto));

        console.log('dias sin stringify', dias);
        console.log('dias', JSON.stringify(dias));

        console.log('pendientes sin stringify', pendiente);
        console.log('pendientes', JSON.stringify(pendiente));


        res.render('pages/dashboard', {
            title: 'Dashboard',
            iconClass: 'fa-solid fa-house',
            currentPath: req.path,
            diasRestantes: JSON.stringify(dias.dias_vaciones),
            asuetos: JSON.stringify(asueto),
            pendientes: JSON.stringify(pendiente.totalPendientes),
        });
    } catch (error) {
        console.error('Error en getDashboard:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
};