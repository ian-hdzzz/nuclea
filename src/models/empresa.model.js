// eslint-disable-next-line no-undef
const db = require('../util/database');

// eslint-disable-next-line no-undef
module.exports = class Empresa {
  /**
   * Constructor de la clase. Sirve para crear un nuevo objeto,
   * y en él se definen las propiedades del modelo.
   * @param {string} nombre - Nombre de la empresa
   * @param {boolean|number} estado - Estado de la empresa
   */
  constructor(nombre, estado) {
    this.nombre = nombre;
    this.estado = estado;
  }

  /**
   * Este método servirá para guardar de manera persistente el nuevo objeto.
   * @return {Promise} Resultado de la consulta
   */
  save() {
    return db.execute(
        'INSERT INTO Empresa (Nombre_empresa, Estado) VALUES (?, ?)',
        [this.nombre, this.estado]
    );
  }

  /**
   * Este método servirá para devolver los objetos del almacenamiento persistente.
   * @return {Promise} Resultado de la consulta con todas las empresas
   */
  static fetchAll() {
    return db.execute('SELECT * FROM Empresa');
  }

  static fetchOne(id) {
    return db.execute('SELECT * FROM Empresa WHERE idEmpresa=?', [id]);
  }

  static Update(idC, name, stat) {
    return db.execute(
        `UPDATE Empresa 
         SET Nombre_empresa = ?, Estado = ?
         WHERE idEmpresa = ?`,
        [name, stat, idC]
    );
  }

   static deleteA(idEmpresa){
              return db.execute(`
                  DELETE FROM Empresa WHERE idEmpresa = ?;
              `,[idEmpresa])
          }
  
};