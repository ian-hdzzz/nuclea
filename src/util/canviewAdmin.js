module.exports = (request, response, next) => {
    console.log(request.session.privilegios);
    let canview = false;
    for (let privilegio of request.session.privilegios) {
        if (privilegio.Nombre_privilegio === 'viewAdmin') {
            console.log("sí puede ver admin");
            canview = true;
            next();
            return; // Para evitar continuar ejecutando el resto del middleware
        }
    }
    if (!canview) {
        response.status(403).send("No tienes permisos para hacer esa acción");    
    }
};