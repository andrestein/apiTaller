/**
 * Servicio de postgress
 *
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

    async insert(folder, fileSql, body) {
        body.uid = this.uuidv4();
        let sqlQuery = await this.getScriptSQL(
            folder,
            fileSql,
            undefined,
            body,
            "POST"
        );
        return await this.execute(sqlQuery);
    }

    async update(folder, fileSql, id, data) {
        let sqlQuery = {};
        if (id == undefined) {
            sqlQuery = {
                query: await this.getScriptSQL(folder, fileSql, id, data, "POST"),
                jsonData: data.jsonData
            };
        } else {
            sqlQuery = {
                query: await this.getScriptSQL(folder, fileSql, id, data, "PUT"),
                jsonData: data.jsonData
            };
        }
        return await this.execute(sqlQuery);
    }

    async delete(folder, fileSql, id) {
        let sqlQuery = await this.getScriptSQL(folder, fileSql, id, {}, "DELETE");
        return await this.execute(sqlQuery);
    }

    uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Obtiene el script SQL de un archivo del ws y utiliza mostache
     * para mapear la consulta.
     * @param folder
     * @param fileSql
     * @param id
     * @param query
     * @param method
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

    fillWhere(query, id) {
        let where = "";
        let nroKey = 0;
        let keys = Object.keys(query).length;
        let comodin = query.comodin != undefined ? "LIKE" : query.comodin;
        for (let key in query) {
            if (comodin === "LIKE") where += `${key} LIKE '%${query[key]}%'`;
            else where += `${key} = '${query[key]}'`;
            if (nroKey < keys - 1) where += " AND ";
            nroKey++;
        }
        return where;
    }

    /**
     * ejecuta las sentencias sql
     * @param sql -> En caso de que sea un objeto este valida si tiene informacion de tipo metadato para insertar.
     * @returns {Promise<undefined|*>}
     */

    async execute(sql) {
        let sqlJson = sql;
        if (sqlJson.jsonData != undefined) {
            return await this.client.query(sql.query, [sql.jsonData]);
        }

        if (sqlJson.query != undefined) {
            return await this.client.query(sqlJson.query);
        } else
            return !sql.includes("NO FILE")
                ? await this.client.query(sql)
                : undefined;
    }

    async executeQuery(sql) {
        if (!sql.includes("NO FILE")) {
            let data = await this.client.query(sql);
            return data.rows;
        } else {
            return [];
        }
    }
}
