//faltas controller
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const crypto = require('crypto');

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}


exports.get_users = (req, res, next) => {

    Role.fetchAll().then(([roles, fD])=>{
        console.log("Roles obtenidos:", roles)
        Usuario.fetchAll().then(([rows, fieldData])=>{
            const tempPassword = generateRandomPassword();
            res.render('../views/pages/users.hbs',{
                rols:roles,
                csrfToken: req.csrfToken(),
                usuarios: rows,
                tempPassword: tempPassword
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error)
    })
};

exports.post_users = (request, response, next) => {
    console.log(request.body);
    const usua = new Usuario(request.body.name_us, request.body.lastname_us, request.body.email_us, request.body.country_us, request.body.city_us,
                                request.body.street_us, request.body.model_us, request.body.passw, request.body.status_us, request.body.start_date, request.body.end_date, request.body.dias_vacaciones
     );
    usua.save()
        .then(([result]) => {
            usuarioId = result.insertId; // Obtener el ID del usuario insertado
            const idRol = request.body.role; // Obtener el rol seleccionado en el formulario
            Role.asign(usuarioId, idRol)
        })
        .then(() => {
            response.redirect('/nuclea/users');
        })
        .catch((error) => {
            console.log(error);
        });
};

