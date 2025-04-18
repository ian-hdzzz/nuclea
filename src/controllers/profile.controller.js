exports.getProfile = (req, res, next)=>{
    res.render('./pages/profile', {
        nombre: req.session.nombre || [],
        apellidos: req.session.apellidos || [],
        email: req.session.email || [],
        registration: req.session.registration || [],
        ciudad: req.session.ciudad || [],
        pais: req.session.pais || [],
        calle: req.session.calle || [],
        departamentos: req.session.departamentos || [],
        title: 'Profile',
        iconClass: 'fa-solid fa-user',
    });
};