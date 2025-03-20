const db = require('../util/database');

module.exports = class Role {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en Ã©l se definen las propiedades del modelo

    //Este mÃ©todo servirÃ¡ para guardar de manera persistente el nuevo objeto. 

    //Este mÃ©todo servirÃ¡ para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM Roles');
    }
    
    static asign(usuarioId, idRol) {
        return db.execute(`INSERT INTO User_Rol (idUsuario, idRol) VALUES (?, ?)`, [usuarioId, idRol]);
    }

}