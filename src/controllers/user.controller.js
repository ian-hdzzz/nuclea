
//faltas controller
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const crypto = require('crypto');
const Dept = require('../models/departament.model');
const Empresa = require('../models/empresa.model');

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}


exports.get_users = async (req, res, next) => {
    try {
        const [emp] = await Empresa.fetchAll();
        const [roles] = await Role.fetchAll();
        const [usuarios] = await Usuario.fetchAll();
        const [deptos] = await Dept.fetchDept();
        const [all] = await Usuario.fetchDeptAll();

        const nousers = all.length === 0;
        const tempPassword = generateRandomPassword();

        const mensaje = req.session.info || '';
        if (req.session.info) {
            req.session.info = '';
        }

        const mensajeerror = req.session.errorUSU || '';
        if (req.session.errorUSU) {
            req.session.errorUSU = '';
        }

        res.render('../views/pages/users.hbs', {
            rols: roles,
            csrfToken: req.csrfToken(),
            usuarios: all,
            tempPassword,
            deptos,
            noUsers: nousers,
            emps: emp,
            info: mensaje,
            error: mensajeerror,
            title: 'Users',
        });
    } catch (err) {
        console.error('Error en get_users:', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.post_users = (request, response, next) => {
    console.log("Datos recibidos en POST /users:", request.body);

    const action = request.body.action;

    if (!request.body.password) {
        console.error("Error: La contraseña es undefined.");
        return response.status(400).send("Error: Falta la contraseña.");
    }

    const deptId = request.body.depa ?? null;
    const empresaId = request.body.company ?? null;

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
            request.session.info = `User registered correcly`;
            response.redirect('/nuclea/users');
        })
        .catch((error) => {
            request.session.errorUSU = `Error registering user.`;
            response.redirect('/nuclea/users');
            response.status(500);
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

