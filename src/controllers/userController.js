
//faltas controller
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const crypto = require('crypto');
const Dept = require('../models/departament.model');

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}


exports.get_users = (req, res, next) => {

    Role.fetchAll().then(([roles, fD])=>{
        console.log("Roles obtenidos:", roles)
        Usuario.fetchAll().then(([rows, fieldData])=>{
            Dept.fetchDept().then(([dept,FD])=>{
                Usuario.fetchDeptAll().then(([all,FiDA])=>{
                    const tempPassword = generateRandomPassword();
                    res.render('../views/pages/users.hbs',{
                    rols:roles,
                    csrfToken: req.csrfToken(),
                    usuarios: all,
                    tempPassword: tempPassword,
                    deptos:dept
                })
                

            })
            
            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error)
    })
};

exports.post_users = (request, response, next) => {
    console.log("Datos recibidos en POST /users:", request.body);

    const action = request.body.action; // Obtener el valor del campo oculto

    if (action === "register") {
        // Lógica para registrar un nuevo usuario
        if (!request.body.password) {
            console.error("Error: La contraseña es undefined.");
            return response.status(400).send("Error: Falta la contraseña.");
        }

        const usua = new Usuario(
            request.body.name_us,
            request.body.lastname_us,
            request.body.email_us,
            request.body.country_us,
            request.body.city_us,
            request.body.street_us,
            request.body.model_us,
            request.body.password,
            request.body.status_us,
            request.body.start_date,
            request.body.end_date,
            request.body.dias_vacaciones,
            null,
            null,
            null
        );

        usua.save()
            .then(([result]) => {
                if (!result || !result.insertId) {
                    throw new Error("No se pudo obtener el ID del usuario insertado.");
                }
                const usuarioId = result.insertId;
                console.log("Usuario insertado con ID:", usuarioId);

                const idRol = request.body.role;
                return Role.asign(usuarioId, idRol);
            })
            .then(() => {
                response.redirect('/nuclea/users');
            })
            .catch((error) => {
                console.error("Error en post_users (register):", error);
                response.status(500).send("Error interno del servidor.");
            });

    } else if (action === "assign") {
        // Lógica para asignar un usuario a un departamento
        const usua = new Usuario(
            null, null, null, null, null, null, null, null, null, null, null, null,
            request.body.ch_user, // ID del usuario
            request.body.ch_dept, // ID del departamento
            request.body.ch_date // Fecha de asignación
        );

        usua.assignment()
            .then(() => {
                response.redirect('/nuclea/users');
            })
            .catch((error) => {
                console.error("Error en post_users (assign):", error);
                response.status(500).send("Error interno del servidor.");
            });

    } else {
        // Si el valor de "action" no es válido
        console.error("Error: Acción no válida.");
        response.status(400).send("Error: Acción no válida.");
    }
};