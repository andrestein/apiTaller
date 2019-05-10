/**
 * Servicio de postgreSQL
 */
const fs = require("fs");
const mustache = require("mustache");
const { Pool } = require("pg");
const config = require("../config");

module.exports = {
    Pg: function() {
        return new CrudOperations();
    }
};

class CrudOperations {
    constructor() {
        this.cs = config.connection;
        this.client = new Pool({ connectionString: this.cs });
        this.baseFolder = config.scriptBasePathV1+"restaurante/";
    }

    async getRestaurante(fileName,id) {
        let sqlQuery = await this.getScriptSQL(fileName,id);
        return await this.execute(sqlQuery);
    }

    /**
     * Obtiene el script SQL de un archivo del ws y utiliza mostache
     * para mapear la consulta.
     * @param fileName
     * @param id
     * @returns {Promise<void>}
     */
    async getScriptSQL(fileName, id) {
        let queryTemplate = await this.getQueryTemplate(fileName);
        let jsonData = {};
        if (id) {
            jsonData.id = id;
        }
        return mustache.render(queryTemplate, jsonData);
    }

    /**
     * Segun el verbo, se obtiene el nombre del script sql a mapear.
     * @param fileName
     * @returns {Promise<*>}
     */
    async getQueryTemplate(fileName) {
        let fileTemplate = this.baseFolder + fileName;
        // GET FILE SQL MUSTACHE
        let sqlFileTemplate = mustache.render(fileTemplate);
        return fs.readFileSync(sqlFileTemplate).toString();
    }
    /**
     * ejecuta las sentencias sql
     * @param sql -> En caso de que sea un objeto este valida si tiene informacion de tipo metadato para insertar.
     * @returns {Promise<undefined|*>}
     */
    async execute(sql) {
        return await this.client.query(sql);
    }
}