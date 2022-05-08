/**
 * Systemklasse
 *
 * @module:     System
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import { settings, database } from "../../config/settings.js";
import { default as WebServer } from "./class.webserver.js";
import { Functions as fHelper } from './class.helper.js';
import { default as DBConnection } from './class.database.js';
import { default as Printer } from './class.printer.js';
import { default as Email } from './class.mail.js';
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
    /** Verzeichnis für Logdateien */
    logs;
    /** Verzeichnis für Druckerspooler **/
    export_printer;
    /** Exportierte PDF Dateien **/
    export_pdf;
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
     * Allgemeine Hauptdatenbank
     * @type DBConnection
     */
    DB;

    /**
     * Allgemeine Hilfsklasse
     */
    helper;

    /**
     * Allgemeine Druckfunktionen
     */
    printer;

    /**
     * Allgemeine Email Funktionen
     */
    mail;

    /**
     * InstallModule (werden nach Start wieder entfernt)
     * @type {[]}
     */
    installModules = [];

    /**
     * Bekanntmachung der Module im gesamten System
     * - so kann auch von anderen Modulen leichter auf das jeweilige Modul zugegriffen werden
     * - Achtung! Module sind NICHT instanziiert und dies wird auch nicht empfohlen!
     * @example app.modules.account = Account (Standardmodul Account)
     * @type {{}}
     */
    modules = {};

    /**
     * Rechte
     * @type {[]}
     */
    rights = [];

    /**
     * Timer welche Zeitgesteuert ausgeführt werden sollen
     * @type {[]}
     */
    timers = [];

    /**
     * Frontend Klasse
     * @type {*}
     */
    frontend = undefined;

    server_logfile = 'server.txt'; // Wird nach abschluss überschrieben, Backup falls etwas beim Startvorgang schief geht!

    /**
     * Instanziiert die App Klasse
     */
    constructor() {
        let currTimestamp = fHelper.dateTime.getCurrentDateTime();
        this.server_logfile = "server_" + currTimestamp.year + "_" + currTimestamp.month + "_" + currTimestamp.day + ".txt";

        this.settings = settings;
        this.SetDirectories();
        this.events = new EventEmitter();
        this.helper = fHelper;
        this.web = new WebServer(this);
        this.frontend = new Frontend();
        this.printer = new Printer();
        this.mail = new Email();
        this.checkLogFile();

    }

    /**
     * Setzen der Standardverzeichnisse
     * - Kann für einzelne Module erweitert werden
     * @constructor
     */
    SetDirectories() {
        this.directories = new Directories();
        this.directories.root = fs.realpathSync('.');                                      // Root Path
        this.directories.backend = path.join(this.directories.root, 'resources', 'backend');    // Backend Source
        this.directories.frontend = path.join(this.directories.root, 'resources', 'frontend');  // Frontend Source
        this.directories.import = path.join(this.directories.root, 'import');      // Import Source
        this.directories.export = path.join(this.directories.root, 'export');      // Export Source
        this.directories.logs = path.join(this.directories.root, 'resources', 'logFiles');      // Logfiles
        this.directories.export_printer = path.join(this.directories.root, 'export', 'printer');
        this.directories.export_pdf = path.join(this.directories.root, 'export', 'pdf');
    }

    /**
     * Ausführen der Initfunktion aller Module
     * - Zuordnen der Datenbanken
     * - Starten der Hauptdatenbank
     * @returns {Promise<void>}
     */
    async init() {
        /**
         * Liste aller Datenbanktabellen für Hauptdatenbank
         * @type {*[]}
         */
        let entityArray = [];

        await this.helper.lists.asyncForEach(this.installModules, async(module) => {
            if ( module ) {
                // Starten der Init Funktion
                let moduleName = 'undefined';
                if ( module.moduleName ) { moduleName = module.moduleName; }
                if ( module.init ) { await module.init(); }

                //#region Zuordnung der Datenbanken
                if ( module.entities && module.entities.length > 0 ) {
                    for ( let i = 0; i < module.entities.length; i++ ) {
                        if ( module.entities[i] !== undefined ) {
                            entityArray.push(module.entities[i]);
                        }
                    }
                }
                //#endregion Entities

                //#region Zuordnung der Rechte
                if ( module.rights && module.rights.length > 0 ) {
                    this.rights[moduleName] = module.rights;
                }
                //#endregion Rights
            }
        });

        // Starten der Installation, wenn Datenbank korrekt gestartet
        this.events.on(`database:${database.default.database}:connected`, () => { this.install(); } );

        // Starten der Hauptdatenbank
        this.DB = new DBConnection(entityArray, database.default, true);

    }

    /**
     * Ausführen der Installationsfunktionen aller Module
     * @returns {Promise<void>}
     */
    async install() {
        await this.helper.lists.asyncForEach(this.installModules, async(module) => {
            if ( module && module.install) { await module.install(); }
        })

        await this.start();
    }

    /**
     * Ausführen der Startfunktion und Timer aller Module
     * @returns {Promise<void>}
     */
    async start() {
        // Ausführen der Startfunktion
        await this.helper.lists.asyncForEach(this.installModules, async(module) => {
            if ( module && module.start ) { await module.start(); }
        });

        // Start der Timer
        this.timers.forEach(item => {
            if ( item.interval > 0 && item.function ) {
                item.myTimer = setInterval(item.function, item.interval);
            }
        });

        // Add Frontend Functions that need the App
        Frontend.afterStart();

        this.events.emit("app:start:finish");
    }

    /**
     * Hinzufügen eines InstallationsModuls
     * - Wichtig! Muss vor dem Initialisieren und Installieren geschehen!
     * - Wichtig! Diese Liste wird nach Start wieder gelöscht!
     */
    addInstallModule(module) {
        this.installModules.push(module);
    }

    /**
     * Anlegen der Logiles, ggfl. Backup der alten Logfiles
     */
    async checkLogFile() {
        await fs.mkdir(this.directories.logs, () => {
            recursive: true
        });
    }

    /**
     * Gibt eine Fehlermeldung aus
     * @param error
     * @param moduleName
     */
    logError(error, moduleName) {
        if ( !moduleName ) { moduleName = '--unknown--'; }
        console.log(">>> --------------------------- >>> ");
        if ( moduleName ) { console.log(`Module: ${moduleName}`)}
        console.error(error);
        console.log("<<< --------------------------- <<< ");
        let newMessage = "\n" + `Log: ${this.helper.dateTime.getCurrentDateTime().realString} [${moduleName}][Fehler-Simple] ${error.message}`;
        fs.appendFile(this.directories.logs + '/' + this.server_logfile, newMessage, function (err) { if (err) throw err; });
        newMessage = "\n" + `Log: ${this.helper.dateTime.getCurrentDateTime().realString} [${moduleName}][Fehler-Full] ${error.stack}`;
        fs.appendFile(this.directories.logs + '/' + this.server_logfile, newMessage, function (err) { if (err) throw err; });
    }

    /**
     * Gibt eine Nachricht per Console aus
     * @param {*} message Nachricht, welche ausgegeben werden soll
     * @param {string} moduleName Name des Moduls
     */
    log(message, moduleName = '', canSimple = true) {
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
            fs.appendFile(this.directories.logs + '/' + this.server_logfile, "\n" + this.helper.dateTime.getCurrentDateTime().realString, function (err) { if (err) throw err; });
            fs.appendFile(this.directories.logs + '/' + this.server_logfile, "\n" + JSON.stringify(message), function (err) { if (err) throw err; });
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
        let newMessage = "\n" + `Log: ${this.helper.dateTime.getCurrentDateTime().realString} [${moduleName}] ${message}`;
        console.log(newMessage);
        fs.appendFile(this.directories.logs + '/' + this.server_logfile, newMessage, function (err) { if (err) throw err; });
    }
}
//#endregion ClassApp

let app;

app = app ? app : new ClassApp();
export { app };