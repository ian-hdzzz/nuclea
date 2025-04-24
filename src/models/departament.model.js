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

    static async deleteA(idDepartamento) {
        await db.execute(`DELETE FROM PerteneceDepa WHERE idDepartamento = ?`, [idDepartamento]);
        await db.execute(`DELETE FROM Departamentos WHERE idDepartamento = ?`, [idDepartamento]);
    }

    static fetchFAI(idDepartamento) {
        return db.execute(`
            SELECT d.*, e.idEmpresa, e.Nombre_empresa
            FROM Departamentos d
            LEFT JOIN PerteneceDepa pd ON d.idDepartamento = pd.idDepartamento
            LEFT JOIN Empresa e ON pd.idEmpresa = e.idEmpresa
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
        return db.execute(`
            SELECT 
                d.idDepartamento,
                d.Nombre_departamento,
                e.Nombre_empresa,
                d.Descripcion,
                d.Estado
            FROM Departamentos d
            LEFT JOIN PerteneceDepa pd ON d.idDepartamento = pd.idDepartamento
            LEFT JOIN Empresa e ON pd.idEmpresa = e.idEmpresa;
        `);
    }
    static fetchOne(id) {
        return db.execute('SELECT * FROM personajes WHERE id=?', [id]);
    }

    static async Update(idDepartamento, nombre, descripcion, estado, idEmpresa) {
        // Actualizar departamento
        await db.execute(
            `UPDATE Departamentos 
             SET Nombre_departamento = ?, Descripcion = ?, Estado = ?
             WHERE idDepartamento = ?`,
            [nombre, descripcion, estado, idDepartamento]
        );
    
        // Verificar si ya existe una relación en PerteneceDepa
        const [rows] = await db.execute(
            `SELECT * FROM PerteneceDepa WHERE idDepartamento = ?`,
            [idDepartamento]
        );
    
        if (rows.length > 0) {
            // Si ya existe, actualiza
            await db.execute(
                `UPDATE PerteneceDepa 
                 SET idEmpresa = ?
                 WHERE idDepartamento = ?`,
                [idEmpresa, idDepartamento]
            );
        } else {
            // Si no existe, inserta nueva relación
            await db.execute(
                `INSERT INTO PerteneceDepa (idDepartamento, idEmpresa)
                 VALUES (?, ?)`,
                [idDepartamento, idEmpresa]
            );
        }
    }

    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

    static searchByName(name) {
        return db.execute(`
            SELECT 
                d.idDepartamento,
                d.Nombre_departamento,
                d.Descripcion,
                d.Estado,
                e.idEmpresa,
                e.Nombre_empresa
            FROM Departamentos d
            JOIN PerteneceDepa pd ON d.idDepartamento = pd.idDepartamento
            JOIN Empresa e ON pd.idEmpresa = e.idEmpresa
            WHERE d.Nombre_departamento LIKE ?
            ORDER BY d.idDepartamento ASC
        `, [`%${name}%`]);
    }

}