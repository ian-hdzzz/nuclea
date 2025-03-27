exports.get_profile = (req, res, next)=>{
    res.render('./pages/profile', {
        id: req.session.idUsuario || [],
        nombre: req.session.nombre || [],
        apellidos: req.session.apellidos || [],
        email: req.session.email || [],
        registration: req.session.registration || [],
        ciudad: req.session.ciudad || [],
        pais: req.session.pais || [],
        calle: req.session.calle || [],
        departamentos: req.session.departamentos || [],

    });
};