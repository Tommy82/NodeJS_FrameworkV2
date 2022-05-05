/**
 *  Global Database Class
 *  Optimized for MySQL
 *  Using "TypeORM", so you can use 'mysql', 'mssql', 'oracle', ... Please read 'https://typeorm.io/#/'
 *
 *  @author: Thomas Göttsching
 *  @version 1.0
 *  @revision: 1
 */

import { app } from './class.app.js';
import orm from 'typeorm';
import { default as mysql } from 'mysql';

/** Global Database Class */
export default class DBConnection {
    /** Database Connection **/
    connection = undefined;
    /** true = Connected Successful | false = Connected Failed **/
    isConnected = false;
    currConnection = undefined;
    #config = {};

    /**
     * Instantiate a new Database Class
     * @param {ClassApp} app Global App
     * @param {array} entityArray List of all orm.EntitySchemas
     * @param {events.EventEmitter} coreEvents Global EventManager
     * @param {boolean} syncDatabase true = Create the Database Tables by EntitySchema
     */
    constructor(entityArray, databaseConnection, syncDatabase = false) {
        try {
            // Check if connection exists, otherwise create a new Instance
            if ( this.currConnection === undefined ) {
                // Create Config File for TypeORM Module
                this.#config = {
                    type:       `${databaseConnection.type}`,
                    host:       `${databaseConnection.host}`,
                    port:        databaseConnection.port,
                    username:   `${databaseConnection.user}`,
                    password:   `${databaseConnection.pass}`,
                    database:   `${databaseConnection.database}`,
                    entities:   entityArray,
                    cache:      true
                }

                orm.createConnection(this.#config)                        // Create Connection
                    .then(conn => {
                        this.connection = conn;                     // Make Connection globally in complete Class
                        if ( syncDatabase ) {
                            conn.synchronize()                      // Sync DataTables
                                .then(() => {
                                    this.isConnected = true;
                                    this.currConnection = this;     // Set Global Connection Variable
                                    app.log(`Database [${databaseConnection.database}] erfolgreich verbunden und syncronisiert!`, "System-Database");
                                    app.events.emit(`database:${databaseConnection.database}:connected`);
                                })
                                .catch(err => {
                                    app.logError(err, "System-Database");
                                    app.events.emit(`database:${databaseConnection.database}:failed`);
                                })
                        } else {
                            this.isConnected = true;
                            this.currConnection = this;             // Set Global Connection Variable
                            app.log(`Database [${databaseConnection.database}] erfolgreich verbunden!`, "System-Database");
                            app.events.emit(`database:${databaseConnection.database}:connected`);
                        }
                    })
                    .catch(err => {
                        app.events.emit(`database:${databaseConnection.database}:failed`);
                    })
            }
        } catch ( err ) {
            app.logError(err, "System-Database");
            app.events.emit(`database:[unknown]:failed`);
        }
    }

    /**
     * Delete all Records with the specific ID´s from Database Table
     * @param {string} repoName TableName | EntitySchema.Name
     * @param {array} ids List of ID´s or a single ID
     * @returns {Promise<unknown>}
     * @example core.database.deleteById('modules', [1]) -> Delete the Record with ID: 1
     */
    async deleteById(repoName, ids) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let idRef = ids;
                if ( !Array.isArray(ids)) {
                    idRef = [ids];
                }
                repo.delete(idRef)
                    .catch (err => { return reject(err); })
                    .then(res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })

    }

    /**
     * Delete all Records where the value in a specific Column
     * @param {string} repoName TableName | EntitySchema.Name
     * @param {object} document Array of delete TableRow | { column: value} | example: {'name': 'myValue'}
     * @return {Promise<void>}
     */
    async delete(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.delete(document)
                    .catch ( err => { return reject(err); })
                    .then(res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search all Records with the specific Parameters
     * @param {string} repoName TableName | EntitySchema.name
     * @param {object} document
     * @returns {Promise<unknown>}
     */
    async find(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.find({ where: document})
                    .catch ( err => { return reject(err); })
                    .then( res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Get all Records of a Table
     * @param {string} repoName TableName | EntitySchema.name
     * @returns {Promise<unknown>}
     */
    async findAll(repoName) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.find()
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search the one Record with the specific ID or IDs
     * @param {string} repoName TableName |
     * @param {array} ids List of ID´s
     * @return {Promise<Record>}
     */
    async findById(repoName, ids) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let idRef = ids;
                if (!Array.isArray(ids)) {
                    idRef = [ids]
                }
                repo.findByIds(idRef)
                    .then(res => {
                        if ( Array.isArray(ids)) { return resolve(res);  }
                        else {
                            if ( res && res.length > 0 ) { return res[0]; }
                            else { return null; }
                        }
                    })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search the one Record with the specific Field Value
     * @param {string} repoName TableName | EntitySchema.name
     * @param {string} fieldName TableColumn
     * @param {string} fieldValue Value that should be search in the TableColumn.
     * @return {Promise<Record>}
     */
    async findOne(repoName, fieldName, fieldValue) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.findOne({ where: { [fieldName]: fieldValue }})
                    .then(res => { return resolve(res); })
                    .catch ( err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Create a new Database Entry
     * @param {string} repoName TableName | EntitySchema.name
     * @param {object} document Record Content as Object
     * @returns {Promise<unknown>}
     */
    async insert(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.insert(document)
                    .catch (err => { return reject(err); })
                    .then(res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Select the specific Columns from Database Table
     * @param {string} repoName TableName | EntitySchema.name
     * @param {array} fieldNames Array of TableColumns
     * @returns {Promise<unknown>}
     */
    async select(repoName, fieldNames) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let selectionRef = fieldNames;
                if (!Array.isArray(fieldNames)) {
                    selectionRef = [fieldNames];
                }
                repo.find( {select: selectionRef })
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch(err) { return reject(err); }
        })
    }

    /**
     * Update the Database Entry with the specific ID
     * @param {string} repoName TableName | EntitySchema.name
     * @param {int} id ID that should be updated
     * @param {object} document Record Content as Class
     * @returns {Promise<unknown>}
     */
    async update(repoName, id, document) {
        return new Promise((resolve, reject) => {

            const repo = this.connection.manager.getRepository(repoName);
            repo.findByIds([id])
                .then(res => {
                    if (res.length <= 0) { return resolve(undefined); }

                    repo.update(id, document)
                        .then(res => { return resolve(res); })
                        .catch(err => { reject(err); });
                })
                .catch(err => { reject(err); });
        })
    }

    /**
     * Update or Insert a new Item
     * @param {string} repoName Name of Table / Entity
     * @param {array | {}} document
     * @return {Promise<array>}
     */
    async upsert(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.save(document)
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Führt einen einzelnen Query aus
     * @param {string} sqlQuery SQL String welcher ausgeführt werden soll
     * @returns {Promise<unknown>}
     */
    async query(sqlQuery) {
        return new Promise(async (resolve, reject) => {
            try {
                switch ( this.#config.type ) {
                    case "mysql":
                        let connection = await mysql.createConnection({
                            host: `${this.#config.host}`,
                            port: this.#config.port,
                            user: `${this.#config.username}`,
                            password: `${this.#config.password}`,
                            database: `${this.#config.database}`
                        });
                        await connection.connect(function(err) {
                            if ( err ) { return reject(err); }
                            connection.query(sqlQuery, function(err, result) {
                                if (err) return reject(err);
                                return resolve(result);
                            })
                        })
                        break;
                    case "mssql":
                        return reject(new Error("Not included!"));
                        break;
                }
            } catch ( err ) { return reject(err); }
        })
    }
}