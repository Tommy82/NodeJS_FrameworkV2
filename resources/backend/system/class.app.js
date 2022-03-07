import { settings, database } from "../../config/settings.js";
import { default as WebServer } from "./class.webserver.js";
import { default as Helper } from './class.helper.js';
import { default as DBConnection } from './class.database.js';
import { EventEmitter } from 'events';

import fs from 'fs';
import path from 'path';

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

    constructor() {
        this.settings = settings;
        this.SetDirectories();
        this.events = new EventEmitter();
        this.helper = new Helper();
        this.web = new WebServer(this);
    }

    SetDirectories() {
        this.directories = new Directories();
        this.directories.root = fs.realpathSync('.');                                           // Root Path
        this.directories.backend = path.join(this.directories.root, 'resource', 'backend');     // Backend Source
        this.directories.frontend = path.join(this.directories.root, 'resource', 'frontend');   // Frontend Source
        this.directories.import = path.join(this.directories.root, 'resource', 'import');       // Import Source
        this.directories.export = path.join(this.directories.root, 'resource', 'export');       // Export Source
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
                    for ( let i = 0; i < module.rights.length; i++ ) {
                        if ( module.rights[i] !== undefined) {
                            this.rights.push({
                                moduleName: moduleName,
                                key: module.rights[i].key,
                                desc: module.rights[i].desc,
                                defaultRole: module.rights[i].defaultRole
                            })
                        }
                    }
                }
                //#endregion Rights
            }
        });
        this.DB = new DBConnection(entityArray, this.events, database.default, true).catch(err => { console.error(err); });
    }

    async install() {
        await this.helper.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.install) { await module.install(); }
        })
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
        })
    }

    /**
     * Hinzufügen eines Moduls
     * - Wichtig! Muss vor dem Initialisieren und Installieren geschehen!
     */
    addModule(module) {
        this.modules.push(module);
    }
}
//#endregion ClassApp

let app;

app = app ? app : new ClassApp();
export { app };