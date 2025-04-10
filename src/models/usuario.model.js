  // eslint-disable-next-line no-undef
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
      my_date,
      my_google_id = null,
      my_google_token = null,
      my_comany      
  
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
      this.google_id = my_google_id;
      this.google_token = my_google_token;
      this.company = my_comany;
    }
    
    //Este método servirá para guardar de manera persistente el nuevo objeto.
    save() {
      if (this.password) {
        return bcrypt
          .hash(this.password, 12)
          .then((password_cifrado) => {
            return db.execute(
              `INSERT INTO Usuarios (Nombre, Contrasena, Apellidos, Correo_electronico, Fecha_inicio_colab, Fecha_vencimiento_colab, Ciudad, Pais, Calle, Modalidad, Estatus, dias_vaciones, google_id, google_token)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                this.google_id,
                this.google_token,
                
              ]
            );
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // Para registro con Google (sin contraseña local)
        return db.execute(
          `INSERT INTO Usuarios (Nombre, Apellidos, Correo_electronico, Fecha_inicio_colab, Fecha_vencimiento_colab, Ciudad, Pais, Calle, Modalidad, Estatus, dias_vaciones, google_id, google_token)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            this.name,
            this.lastname,
            this.email,
            this.start_date || new Date(),
            this.end_date,
            this.city || '',
            this.country || '',
            this.street || '',
            this.model || 'Google',
            this.status || 'Activo',
            this.dvacaciones || 0,
            this.google_id,
            this.google_token,
          ]
        );
      }
    }
    
    // Método para crear o actualizar un usuario que se autenticó con Google
    static saveGoogleUser(googleProfile, googleToken) {
      // Primero verificamos si el usuario ya existe
      return this.fetchOneByGoogleId(googleProfile.id)
        .then(([user]) => {
          if (user && user.length > 0) {
            // El usuario ya existe, actualizamos el token
            return db.execute(
              "UPDATE Usuarios SET google_token = ? WHERE google_id = ?",
              [googleToken, googleProfile.id]
            );
          } else {
            // Verificamos si existe un usuario con el mismo email
            return this.fetchOne(googleProfile.emails[0].value)
              .then(([emailUser]) => {
                if (emailUser && emailUser.length > 0) {
                  // Actualizar usuario existente con credenciales de Google
                  return db.execute(
                    "UPDATE Usuarios SET google_id = ?, google_token = ? WHERE Correo_electronico = ?",
                    [googleProfile.id, googleToken, googleProfile.emails[0].value]
                  );
                } else {
                  // Crear nuevo usuario
                  const newUser = new Usuario(
                    googleProfile.name.givenName || '',
                    googleProfile.name.familyName || '',
                    googleProfile.emails[0].value,
                    '', // country
                    '', // city
                    '', // street
                    'Google', // model
                    null, // password
                    'Activo', // status
                    new Date(), // start_date
                    null, // end_date
                    0, // dvacaciones
                    null, // user
                    null, // dept
                    null, // date
                    googleProfile.id, // google_id
                    googleToken // google_token
                  );
                  return newUser.save();
                }
              });
          }
        });
    }
    
    assignment() {
      return db.execute(
        `INSERT INTO Pertenece (idUsuario, idDepartamento, idEmpresa)
           VALUES (?,?,?)`,
           [this.user, this.dept, this.company]
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
        GROUP BY u.idUsuario;`, [email]);
    }
    
    static fetchOne(email) {
      return db.execute("SELECT * FROM Usuarios WHERE Correo_electronico=?", [
        email,
      ]);
    }
    
    static fetchbyId(idUsuario) {
      return db.execute(`
        SELECT
          u.*,
          GROUP_CONCAT(d.Nombre_departamento SEPARATOR ', ') AS Departamentos
        FROM Usuarios u
        LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
        LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
        WHERE u.idUsuario = ?
        GROUP BY u.idUsuario;
      `, [idUsuario]);
    }
    
    static fetchOneByGoogleId(googleId) {
      return db.execute("SELECT * FROM Usuarios WHERE google_id=?", [googleId]);
    }
    
    static fetch(email) {
      if (email) {
        return this.fetchOne(email);
      } else {
        return this.fetchAll();
      }
    }

    static async deleteA(idUsuario) {
      await db.execute(`DELETE FROM User_Rol WHERE idUsuario = ?`, [idUsuario]);
      await db.execute(`DELETE FROM Pertenece WHERE idUsuario = ?`, [idUsuario]);
      return db.execute(`DELETE FROM Usuarios WHERE idUsuario = ?`, [idUsuario]);
  }

  static fetchUserDetails(idUsuario) {
    return db.execute(`
          SELECT 
          u.*, 
          GROUP_CONCAT(DISTINCT d.Nombre_departamento SEPARATOR ', ') AS Departamentos,
          GROUP_CONCAT(DISTINCT r.Nombre_rol SEPARATOR ', ') AS Roles,
          GROUP_CONCAT(DISTINCT e.Nombre_empresa SEPARATOR ', ') AS Empresas
      FROM Usuarios u
      LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
      LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
      LEFT JOIN PerteneceDepa pd ON p.idDepartamento = pd.idDepartamento
      LEFT JOIN Empresa e ON pd.idEmpresa = e.idEmpresa
      LEFT JOIN User_Rol ur ON u.idUsuario = ur.idUsuario
      LEFT JOIN Roles r ON ur.idRol = r.idRol
      WHERE u.idUsuario = ?
      GROUP BY u.idUsuario;

    `, [idUsuario]);
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

    static getRolById(idUsuario) {
      return db.execute(`
        SELECT idRol 
        FROM User_Rol 
        WHERE idUsuario = ?
      `, [idUsuario]);
    }
    
    static getCollabsDept(iduser) {
      return db.execute(`
        SELECT u.*
        FROM Usuarios u 
        JOIN Pertenece p ON u.idUsuario = p.idUsuario 
        WHERE p.idDepartamento = (
         SELECT p2.idDepartamento 
         FROM Pertenece p2 
         JOIN Usuarios u2 ON p2.idUsuario = u2.idUsuario WHERE u2.idUsuario = ? );
      `, [iduser]);
    }

    static async update(
      Nombre, 
      Apellidos, 
      Correo_electronico,
      Fecha_inicio_colab, 
      Fecha_vencimiento_colab, 
      Ciudad, 
      Pais, 
      Calle, 
      Modalidad, 
      Estatus, 
      dias_vaciones, 
      idUsuario, 
      idRol, 
      idDepartamento, 
      idEmpresa
    ) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
    
        // 1. Actualizar Usuarios
        await connection.execute(
          `UPDATE Usuarios 
           SET 
             Nombre = ?,
             Apellidos = ?,
             Correo_electronico = ?,
             Fecha_inicio_colab = ?,
             Fecha_vencimiento_colab = ?,
             Ciudad = ?,
             Pais = ?,
             Calle = ?,
             Modalidad = ?,
             Estatus = ?,
             dias_vaciones = ?
           WHERE idUsuario = ?`,
          [
            Nombre,
            Apellidos,
            Correo_electronico,
            Fecha_inicio_colab,
            Fecha_vencimiento_colab,
            Ciudad,
            Pais,
            Calle,
            Modalidad,
            Estatus,
            dias_vaciones,
            idUsuario
          ]
        );
    
        // 2. Actualizar User_Rol
        await connection.execute(
          `UPDATE User_Rol 
           SET idRol = ? 
           WHERE idUsuario = ?`,
          [idRol, idUsuario]
        );
    
        // 3. Actualizar Pertenece (Departamento)
        await connection.execute(
          `UPDATE Pertenece 
           SET idDepartamento = ? 
           WHERE idUsuario = ?`,
          [idDepartamento, idUsuario]
        );
    
        // 4. Actualizar PerteneceDepa (Empresa)
        await connection.execute(
          `UPDATE PerteneceDepa 
           SET idEmpresa = ? 
           WHERE idDepartamento = ?`,
          [idEmpresa, idDepartamento]
        );
    
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }

    static searchByName(name) {
      return db.execute(`
          SELECT 
              u.idUsuario,
              u.Nombre,
              u.Apellidos,
              u.Correo_electronico,
              u.Estatus,
              u.Fecha_inicio_colab,
              u.Modalidad,
              u.Ciudad,
              GROUP_CONCAT(d.Nombre_departamento SEPARATOR ', ') AS Departamentos
          FROM Usuarios u
          LEFT JOIN Pertenece p ON u.idUsuario = p.idUsuario
          LEFT JOIN Departamentos d ON p.idDepartamento = d.idDepartamento
          WHERE u.Nombre LIKE ?
          GROUP BY u.idUsuario
          ORDER BY u.Nombre ASC
      `, [`%${name}%`]);
    }
    
  


  
};


  