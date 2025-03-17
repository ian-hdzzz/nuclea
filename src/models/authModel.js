const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {
  constructor(mi_email, mi_password) {
    this.email = mi_email;
    this.password = mi_password;
  }

  async save() {
    try {
      const password_cifrado = await bcrypt.hash(this.password, 12);
      console.log('user guardado');
      const [result] = await db.execute(
        'INSERT INTO usuarios(email, password) VALUES (?,?)', 
        [this.email, password_cifrado]
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw for proper error handling
    }
  }

  static async fetchAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM usuarios');
      console.log('Resultado completo:', rows);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async fetchOne(email) {
    try {
      const [rows1] = await db.execute('SELECT * FROM usuarios');
      console.log('Resultado completo:', rows1);
      const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo_electronico=?', [email]);
      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetch(email) {
    if (email) {
      return this.fetchOne(email);
    } else {
      return this.fetchAll();
    }
  }

  // Uncommented and updated the commented methods
  
//   static async getPrivilegios(email) {
//     try {
//       const [rows] = await db.execute(
//         `SELECT p.nombre
//          FROM privilegios p, rol_privilegio rp, roles r,
//          usuario_rol ur, users u
//          WHERE p.id=rp.privilegio_id AND rp.rol_id=r.id
//          AND r.id=ur.rol_id AND ur.usuario_id=u.id
//          AND u.email=?`,
//         [email]
//       );
//       return rows;
//     } catch (error) {
//       throw error;
//     }
//   }

//   static async assignRoleToUser(email, roleName) {
//     try {
//       const [result] = await db.execute(
//         `INSERT INTO usuario_rol (usuario_id, rol_id)
//          SELECT u.id, r.id
//          FROM users u, roles r
//          WHERE u.email = ? AND r.nombre = ?`,
//         [email, roleName]
//       );
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }
}