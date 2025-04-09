// eslint-disable-next-line no-undef
const db = require('../util/database');

// eslint-disable-next-line no-undef
module.exports = class Holiday {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nombre, fecha,) {
        this.nombre = nombre;
        this.fecha = fecha;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            'INSERT INTO DiasFeriados (Nombre_asueto, Fecha_asueto) VALUES (?, ?)',
            [this.nombre, this.fecha]
        );
        
    }

     static deleteA(idDiaFeriado){
                return db.execute(`
                    DELETE FROM DiasFeriados WHERE idDiaFeriado = ?;
                `,[idDiaFeriado])
            }
    

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM DiasFeriados');
    }

    static fetchOne(id) {
        return db.execute('SELECT * FROM DiasFeriados WHERE idDiaFeriado=?', [id]);
    }
    
    static search(name) {
        if (name) {
            // Búsqueda con filtro
            return db.execute(
                'SELECT * FROM DiasFeriados WHERE Nombre_asueto LIKE ?', 
                [`%${name}%`]
            );
        } else {
            return db.execute('SELECT * FROM DiasFeriados'); 
        }
    }
}

