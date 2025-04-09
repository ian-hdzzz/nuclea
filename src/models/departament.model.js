// eslint-disable-next-line no-undef
const db = require('../util/database');

// eslint-disable-next-line no-undef
module.exports = class Departament {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nombre,descripcion,estado,my_depa,my_company) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.depa = my_depa;
        this.comp = my_company;
        
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
                DELETE FROM PerteneceDepa WHERE idDepartamento = ?;
            `,[idDepartamento])
        }

        static fetchFAI(idDepartamento) {
            return db.execute(`
                SELECT d.*, e.idEmpresa, e.Nombre_empresa
                FROM Departamentos d
                JOIN PerteneceDepa pd ON d.idDepartamento = pd.idDepartamento
                JOIN Empresa e ON pd.idEmpresa = e.idEmpresa
                WHERE d.idDepartamento = ?;
            `, [idDepartamento]);
        }
        

    static fetchDept(){
        return db.execute('SELECT * FROM Departamentos'); //Para el controlador de Usuarios
    }

     assign() {
        return db.execute(
            `INSERT INTO PerteneceDepa (idDepartamento, idEmpresa) VALUES (?, ?)`,
            [this.depa,this.comp]
        );
    }

    static fetchAllDepa() {
        return db.execute(`SELECT 
            d.idDepartamento,
            d.Nombre_departamento,
            d.Descripcion,
             d.Estado,
             e.idEmpresa,
             e.Nombre_empresa
            FROM Departamentos d
            JOIN PerteneceDepa pd ON d.idDepartamento = pd.idDepartamento
            JOIN Empresa e ON pd.idEmpresa = e.idEmpresa;`); //Para el controlador de Usuarios
    }
    

    static fetchOne(id) {
        return db.execute('SELECT * FROM personajes WHERE id=?', [id]);
    }

    static async Update(idDepartamento, nombre, descripcion, estado, idEmpresa) {
        await db.execute(
            `UPDATE Departamentos 
             SET Nombre_departamento = ?, Descripcion = ?, Estado = ?
             WHERE idDepartamento = ?`,
            [nombre, descripcion, estado, idDepartamento]
        );
    
        await db.execute(
            `UPDATE PerteneceDepa 
             SET idEmpresa = ?
             WHERE idDepartamento = ?`,
            [idEmpresa, idDepartamento]
        );
    }

    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

}