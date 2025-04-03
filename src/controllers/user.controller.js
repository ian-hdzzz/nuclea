
//faltas controller
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const crypto = require('crypto');
const Dept = require('../models/departament.model');
const Empresa = require('../models/empresa.model');

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}


exports.get_users = (req, res, next) => {

    Empresa.fetchAll().then(([emp, fD])=>{
        Role.fetchAll().then(([roles, fD])=>{
            console.log("Roles obtenidos:", roles)
            Usuario.fetchAll().then(([rows, fieldData])=>{
                Dept.fetchDept().then(([dept,FD])=>{
                    Usuario.fetchDeptAll().then(([all,FiDA])=>{
                        const nousers = all.length === 0;
                        const tempPassword = generateRandomPassword();
                        res.render('../views/pages/users.hbs',{
                        rols:roles,
                        csrfToken: req.csrfToken(),
                        usuarios: all,
                        tempPassword: tempPassword,
                        deptos:dept,
                        noUsers : nousers,
                        emps: emp,
                        title: 'Users',
                    })
                    }).catch((err)=>{
                        console.error('Error fetching Departments:', err);
                        res.status(500).send('Internal Server Error');
                    });
                }).catch((err)=>{
                    console.error('Error fetching departments:', err);
                    res.status(500).send('Internal Server Error');
                });
            }).catch((err)=>{
                console.error('Error fetching users:', err);
                res.status(500).send('Internal Server Error');
            });
        }).catch((err)=>{
            console.error('Error fetching Roles:', err);
            res.status(500).send('Internal Server Error');
        })
    }).catch((err)=>{
        console.error('Error fetching Empresas:', err);
        res.status(500).send('Internal Server Error');
    })

    
};

exports.post_users = (request, response, next) => {
    console.log("Datos recibidos en POST /users:", request.body);

    const action = request.body.action;

    if (!request.body.password) {
        console.error("Error: La contraseña es undefined.");
        return response.status(400).send("Error: Falta la contraseña.");
    }

    const deptId = request.body.depa || null;
    const empresaId = request.body.company || null;

    console.log("Valores extraídos:", { deptId, empresaId }); // <-- Verifica que no sean undefined aquí

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
        null,
        null, 
        null,
        null
    );

    let usuarioId;

    usua.save()
        .then(([result]) => {
            if (!result || !result.insertId) {
                throw new Error("No se pudo obtener el ID del usuario insertado.");
            }
            usuarioId = result.insertId;
            console.log("Usuario insertado con ID:", usuarioId);

            const idRol = request.body.role;
            return Role.asign(usuarioId, idRol).then(() => usuarioId);
        })
        .then((usuarioId) => { 
            console.log("Valores antes de llamar a assignment():", { usuarioId, deptId, empresaId });

            const asignacion = new Usuario(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                usuarioId,
                deptId,
                null,
                null,
                null,
                empresaId 
            )

            return asignacion.assignment();
        })
        .then(() => {
            response.redirect('/nuclea/users');
        })
        .catch((error) => {
            console.error("Error en post_users (register):", error);
            response.status(500).send("Internal Server Error");
        });
};


exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        //Este código se ejecuta cuando la sesión se elimina.
        response.redirect('/nuclea/signup');
    });
};

