module.exports = (request, response, next) => {
    console.log(request.session.privilegios);
    let canCreate = false;
    for (let privilegio of request.session.privilegios) {
        if (privilegio.nombre == "viewAdmin") {
            console.log("si puede ver admin");
            canCreate = true;
            next();
        }
    }
    if (!canCreate) {
        response.status(403).send("No tienes permisos para hacer esa accion");    
    }
};