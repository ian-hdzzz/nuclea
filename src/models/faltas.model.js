//faltas model
const db = require('../util/database');

module.exports = class Falta {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_usuario,mi_fecha,mi_motivo, my_file) {
        this.usuario = mi_usuario;
        this.fecha = mi_fecha;
        this.motivo = mi_motivo;
        this.file = my_file;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute('INSERT INTO Faltas_administrativas(idUsuario,Fecha_asignacion_falta,Motivo,archivo) VALUES (?,?,?,?)', [this.usuario,this.fecha,this.motivo, this.file]); //Extaer datos de ña base de datos
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchFA() {
        return db.execute(`
            SELECT fa.idFalta, u.Nombre, fa.Motivo, fa.Fecha_asignacion_falta, fa.archivo
            FROM Faltas_administrativas fa 
            JOIN Usuarios u ON fa.idUsuario = u.idUsuario
        `);
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