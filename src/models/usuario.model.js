const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class Usuario {
  //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
  constructor(
    my_name,
    my_lastname,
    my_email,
    my_country,
    my_city,
    my_street,
    my_model,
    my_passw,
    my_status,
    my_start_date,
    my_end_date,
    my_dvacaciones,
    my_user,
    my_dept,
    my_date
  ) {
    this.name = my_name;
    this.lastname = my_lastname;
    this.email = my_email;
    this.country = my_country;
    this.city = my_city;
    this.model = my_model;
    this.password = my_passw;
    this.status = my_status;
    this.start_date = my_start_date;
    this.end_date = my_end_date;
    this.street = my_street;
    this.dvacaciones = my_dvacaciones;
    this.user = my_user;
    this.dept = my_dept;
    this.date = my_date;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return bcrypt
      .hash(this.password, 12)
      .then((password_cifrado) => {
        return db.execute(
          `INSERT INTO Usuarios (Nombre, Contrasena, Apellidos, Correo_electronico, Fecha_inicio_colab, Fecha_vencimiento_colab, Ciudad, Pais, Calle, Modalidad, Estatus, dias_vaciones ) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            this.name,
            password_cifrado,
            this.lastname,
            this.email,
            this.start_date,
            this.end_date,
            this.city,
            this.country,
            this.street,
            this.model,
            this.status,
            this.dvacaciones,
          ]
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  assignment() {
    return db.execute(
      `INSERT INTO Pertenece (idUsuario, idDepartamento, Fecha_asignacion) 
                VALUES (?,?,?)`,
      [this.user, this.dept, this.date]
    );
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchAll() {
    return db.execute("SELECT * FROM Usuarios");
  }

  static fetchDeptAll() {
    return db.execute(`
            SELECT 
            u.*, 
            GROUP_CONCAT(d.Nombre_departamento SEPARATOR ', ') AS Departamentos
            FROM Usuarios u
            LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
            LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
            GROUP BY u.idUsuario;`);
  }

  static fetchDeptSession(email) {
    return db.execute(`
            SELECT 
            u.*, 
            GROUP_CONCAT(d.Nombre_departamento SEPARATOR ', ') AS Departamentos
            FROM Usuarios u
            LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
            LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
            WHERE u.Correo_electronico=?
            GROUP BY u.idUsuario;`,[email]);
  }

  static fetchOne(email) {
    return db.execute("SELECT * FROM Usuarios WHERE Correo_electronico=?", [
      email,
    ]);
  }

  static fetch(email) {
    if (email) {
      return this.fetchOne(email);
    } else {
      return this.fetchAll();
    }
  }

  static getPrivilegios(idusuario) {
    return db.execute(
      `SELECT p.Nombre_privilegio 
            FROM Privilegios p, Rol_Privilegios rp, Roles r, 
                User_Rol ur, Usuarios u
            WHERE p.idPrivilegio=rp.idPrivilegio AND rp.idRol=r.idRol 
                AND r.idRol=ur.idRol AND ur.idUsuario=u.idUsuario
                AND u.idUsuario=?;`,
      [idusuario]
    );
  }

  static findOrCreateGoogleUser(googleProfile) {
    return db.execute("SELECT * FROM Usuarios WHERE Correo_electronico = ?", [googleProfile.email])
      .then(([users]) => {
        if (users.length > 0) {
          return users[0]; // Return existing user
        } else {
          // Create new user with Google profile data
          const newUser = new Usuario(
            googleProfile.given_name,
            googleProfile.family_name,
            googleProfile.email,
            '', // country
            '', // city
            '', // street
            'remoto', // default model
            'google-auth', // password placeholder
            'activo', // default status
            new Date(), // start_date
            null, // end_date
            0, // dvacaciones
            null,
            null,
            null
          );
          return newUser.save()
            .then(() => {
              return this.fetchOne(googleProfile.email)
                .then(([users]) => users[0]);
            });
        }
      });
  }
};