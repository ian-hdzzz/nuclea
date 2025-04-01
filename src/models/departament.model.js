// eslint-disable-next-line no-undef
const db = require('../util/database');

// eslint-disable-next-line no-undef
module.exports = class Departament {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nombre,descripcion,estado) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            'INSERT INTO Departamentos (Nombre_departamento, Descripcion, Estado) VALUES (?, ?, ?)',
            [this.nombre, this.descripcion, this.estado]
        );
        
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM Departamentos');
    }

    static deleteA(idDepartamento){
            return db.execute(`
                DELETE FROM Departamentos WHERE idDepartamento = ?;
            `,[idDepartamento])
        }

    static fetchDept(){
        return db.execute('SELECT * FROM Departamentos'); //Para el controlador de Usuarios
    }

    static fetchOne(id) {
        return db.execute('SELECT * FROM personajes WHERE id=?', [id]);
    }

    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

}