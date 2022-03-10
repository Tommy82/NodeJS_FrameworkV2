import { settings, database } from "../../config/settings.js";
import { default as WebServer } from "./class.webserver.js";
import { default as Helper } from './class.helper.js';
import { default as DBConnection } from './class.database.js';
import { EventEmitter } from 'events';

import fs from 'fs';
import path from 'path';
import Frontend from "./class.frontend.js";

class Directories {
    /** Root Verzeichnis @type string */
    root;
    /** Backend Verzeichnis @type string */
    backend;
    /** Frontend Verzeichnis @type string */
    frontend;
    /** Import Verzeichnis @type string */
    import;
    /** Export Verzeichnis @type string */
    export;
}

//#region ClassApp
class ClassApp {
    /**
     * Globaler Event emitter
     * @type EventEmitter
     */

    events;
    /**
     * Globale Verzeichnisse
     * @type Directories
     */

    directories;
    /**
     * Globale Einstellungen
     * @type [];
     */

    settings;
    /**
     * Globaler WebServer
     * @type WebServer
     */
    web;

    /**
     * @type DBConnection
     */
    DB;

    /**
     *
     */
    helper;

    /**
     *
     * @type {[]}
     */
    modules = [];

    /**
     *
     * @type {[]}
     */
    rights = [];

    /**
     *
     * @type {[]}
     */
    timers = [];

    frontend = undefined;

    constructor() {
        this.settings = settings;
        this.SetDirectories();
        this.events = new EventEmitter();
        this.helper = new Helper();
        this.web = new WebServer(this);
        this.frontend = new Frontend();
    }

    SetDirectories() {
        this.directories = new Directories();
        this.directories.root = fs.realpathSync('.');                                           // Root Path
        this.directories.backend = path.join(this.directories.root, 'resources', 'backend');     // Backend Source
        this.directories.frontend = path.join(this.directories.root, 'resources', 'frontend');   // Frontend Source
        this.directories.import = path.join(this.directories.root, 'resources', 'import');       // Import Source
        this.directories.export = path.join(this.directories.root, 'resources', 'export');       // Export Source
    }

    async init() {
        let entityArray = [];
        await this.helper.lists.asyncForEach(this.modules, async(module) => {
            if ( module ) {
                let moduleName = 'undefined';
                if ( module.moduleName ) { moduleName = module.moduleName; }
                if ( module.init ) { await module.init(); }

                //#region Entities
                if ( module.entities && module.entities.length > 0 ) {
                    for ( let i = 0; i < module.entities.length; i++ ) {
                        if ( module.entities[i] !== undefined ) {
                            entityArray.push(module.entities[i]);
                        }
                    }
                }
                //#endregion Entities

                //#region Rights
                if ( module.rights && module.rights.length > 0 ) {
                    this.rights[moduleName] = module.rights;
                }
                //#endregion Rights
            }
        });

        this.events.on(`database:${database.default.database}:connected`, () => { this.install(); } );

        this.DB = new DBConnection(entityArray, database.default, true);

    }

    async install() {
        await this.helper.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.install) { await module.install(); }
        })

        await this.start();
    }

    async start() {
        await this.helper.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.start ) { await module.start(); }
        });

        // Start Timers
        this.timers.forEach(item => {
            if ( item.interval > 0 && item.function ) {
                item.myTimer = setInterval(item.function, item.interval);
            }
        });

        // Add Frontend Functions that need the App
        Frontend.afterStart();
    }

    /**
     * Hinzufügen eines Moduls
     * - Wichtig! Muss vor dem Initialisieren und Installieren geschehen!
     */
    addModule(module) {
        this.modules.push(module);
    }

    /**
     * Gibt eine Fehlermeldung aus
     * @param error
     * @param moduleName
     */
    logError(error, moduleName) {
        console.log(">>> --------------------------- >>> ");
        if ( moduleName ) { console.log(`Module: ${moduleName}`)}
        console.error(error);
        console.log("<<< --------------------------- <<< ");
    }

    /**
     * Gibt eine Nachricht per Console aus
     * @param {*} message Nachricht, welche ausgegeben werden soll
     * @param {string} moduleName Name des Moduls
     */
    log(message, moduleName = '', canSimple = true) {
        //TODO: Add To LogFile
        let isSimple = false;
        if ( canSimple ) {
            let simple = ['string', 'int', 'float', 'double', 'boolean' ];
            if ( simple.includes(typeof(message)) ) {
                if ( !moduleName || moduleName.trim() == '' ) { moduleName = "Unknown"; }
                isSimple = true;
            }
        }

        if ( !isSimple ) {
            console.log(">>> ----------" + this.helper.dateTime.getCurrentDateTime().realString + "----------- >>> ");
            if ( moduleName && moduleName.trim() !== '' ) { console.log(`Module: ${moduleName}`)}
            switch ( typeof(message)) {
                case "string": console.log(`Message: ${message}`); break;
                case "int": console.log(`Message: ${message}`); break;
                case "float": console.log(`Message: ${message}`); break;
                case "double": console.log(`Message: ${message}`); break;
                default:
                    console.log(`Message (type: ${typeof(message)}):`);
                    console.log(message);
                    break;
            }
            console.log("<<< --------------------------- <<< ");
        } else {
            this.logSimple(message, moduleName);
        }
    }

    /**
     * Simples Schreiben einer [String|Int|Double] Nachricht
     * @param message
     * @param moduleName
     */
    logSimple(message, moduleName) {
        console.log(`Log: ${this.helper.dateTime.getCurrentDateTime().realString} [${moduleName}] ${message}`);
    }
}
//#endregion ClassApp

let app;

app = app ? app : new ClassApp();
export { app };