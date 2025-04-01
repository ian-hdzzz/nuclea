
//faltas controller
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');
const crypto = require('crypto');
const Dept = require('../models/departament.model');
const nodemailer = require('nodemailer');

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


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
                console.log(process.env.EMAIL_USER);
                console.log(process.env.EMAIL_PASSWORD);
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
    const userEmail = request.body.email_us; // Usamos email_us
    const userPassword = request.body.password
    

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
        .then(()=>{
            console.log("Enviando correo a:", userEmail); // Agregamos un log para depuración
            const mailOptions = {
                from: '"Nuclea App" <flowitdb@gmail.com>',
                to: userEmail,
                subject: 'Login Credentials',
                html: `
                    <h2>!Registration Succesful!</h2>
                    <p>Here are your login credentials:</p>
                    <ul>
                        <li><strong>Email:</strong> ${userEmail}</li>
                        <li><strong>Password:</strong> ${userPassword}</li>
                    </ul>
                    <p>Please store this information securely and do not share it with anyone.</p>
                `
            };

            return transporter.sendMail(mailOptions);
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
    request.logout((err) => {
      if (err) {
        return next(err);
      }
      // Eliminar cookies de sesión
    response.clearCookie('connect.sid');  // 'connect.sid' es la cookie de sesión predeterminada en Express
    // Si tienes otras cookies personalizadas, puedes eliminarlas de manera similar
    // response.clearCookie('nombreCookie');

    // Destruir la sesión
    request.session.destroy(() => {
      // Redirigir después de eliminar las cookies
      response.redirect('/signup'); // Opcional, para cerrar sesión de Google también
    });
    });
  };

