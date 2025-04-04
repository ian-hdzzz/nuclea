
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
                    const nousers = all.length === 0;
                    const tempPassword = generateRandomPassword();
                    res.render('../views/pages/users.hbs',{
                    rols:roles,
                    csrfToken: req.csrfToken(),
                    usuarios: all,
                    tempPassword: tempPassword,
                    deptos:dept,
                    noUsers : nousers,
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
};

exports.post_users = (request, response, next) => {
    console.log("Datos recibidos en POST /users:", request.body);

    const action = request.body.action; // Obtener el valor del campo oculto

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

    let usuarioId;

    usua.save()
        .then(([result]) => {
            if (!result || !result.insertId) {
                throw new Error("No se pudo obtener el ID del usuario insertado.");
            }
            usuarioId = result.insertId;
            console.log("Usuario insertado con ID:", usuarioId);

            const idRol = request.body.role;
            return Role.asign(usuarioId, idRol);
        })
        .then(() => {
            // Asegurar que request.body.departamentos sea un array
            const departamentos = Array.isArray(request.body.departamentos) 
                ? request.body.departamentos 
                : [request.body.departamentos];
        
            const departamentosPromises = departamentos.map(deptId => {
                const asignacion = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, usuarioId, deptId, new Date());
                return asignacion.assignment();
            });
        
            return Promise.all(departamentosPromises);
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


exports.get_delete = (req, res, next) => {
    console.log(req.body)
    Usuario.deleteA(req.params.idUsuario).then(()=>{
        res.redirect('/nuclea/users')
    }).catch((error)=>{
        console.log(error)
    })
  };

  exports.get_view = (req, res, next) => {
    console.log(req.params.idUsuario);
    Usuario.fetchbyId(req.params.idUsuario)
        .then(([rows, fieldData]) => {
            console.log(rows[0]);
            req.session.nombre = rows[0].Nombre;
            req.session.apellidos = rows[0].Apellidos;
            req.session.correo = rows[0].Correo_electronico;
            req.session.ciudad = rows[0].Ciudad;
            req.session.pais = rows[0].Pais;
            req.session.calle = rows[0].Calle;
            req.session.departamentos = rows[0].Departamentos;
            req.session.registration = rows[0].Fecha_inicio_colab;
            res.render('../views/pages/profile.hbs', {
                csrfToken: req.csrfToken(),
                usuario: rows[0],
                title: 'View User',
                nombre: req.session.nombre,
                apellidos: req.session.apellidos,
                pais: req.session.pais,
                ciudad: req.session.ciudad,
                calle: req.session.calle,
                departamentos: req.session.departamentos,
                email: req.session.correo,
                registration: req.session.registration,

            });
        }) // Cierra el .then() correctamente
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al obtener el usuario");
        }); // Manejo de errores opcional
}; // Cierre correcto de la función

