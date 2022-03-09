/**
 *  Global ClassWebserver Class
 *
 *  @author     Thomas Göttsching
 *  @version    1.0
 *  @revision   2
 */

import express from 'express';
import { default as session } from 'express-session';
import flash from 'express-flash';
import Twig from 'twig';
import pug from 'pug';
import methodOverride from 'method-override';
import fs from 'fs';
import path from 'path';

export default class ClassWebserver {
    #server = undefined;
    #router = undefined;
    #app;
    isOnline = false;
    prefix = '';

    constructor(app) {
        this.#app = app;
        this.#server = express();                                           // Initialize Express Webserver

        this.#server.engine('twig', Twig.__express);                        // ... set Twig to Express as default Engine
        this.#server.set('view-engine', 'twig');                            // ... set twig as View Engine
        this.#server.set('twig options', {
            allow_async: true, // Allow asynchronous compiling
            strict_variables: false
        });                           // ... set Twig Options
        this.#server.set('views', app.directories.frontend);                // ... set Frontend Directory
        this.#server.set('view options', {layout: false});                  // Set View Options
        this.#server.use(express.static(app.directories.frontend));         // Set Frontend Static Directory ( needed for "include files" like 'js', 'css', 'png' ...)

        this.prefix = '';
        if ( app.settings.webServer.prefix && app.settings.webServer.prefix !== '' ) {
            this.prefix = app.settings.webServer.prefix;
            this.router = new express.Router();
            this.router.use(this.prefix, () => {});
            this.#server.use(this.prefix, express.static(app.directories.frontend));
            this.#server.use(this.prefix, this.router);
        }

        this.#server.use(express.urlencoded({extended: false}));            // Set Url Encoding
        this.#server.use(flash());                                          // Include Flash to set direct Messages on HTML Form
        this.#server.use(session({                                          // Set WebServer Session
            secret: app.settings.webServer.sessionKey,
            resave: false,
            saveUninitialized: false
        }));
        this.#server.use(methodOverride('_method'));                        // Allow Method Override
        this.#server.listen(app.settings.webServer.port);                       // Start WebServer with Port given in Settings File
        this.isOnline = true;                                           // Set Internal Parameter to true, so Modules that initialize later can see that Server is online
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    checkLogin_Backend(req, res, next) {
        return next();
    }

    checkLogin_Frontend(req, res, next) {
        return next();
    }

    /**
     * Hinzufügen einer Route zum Webserver
     * @param {string} type Art der Übermittlung ("get" | "post")
     * @param {string} url Url, auf welche reagiert werden soll (Achtung! OHNE Prefix!!!)
     * @param {*} callback Funktion, welche ausgeführt werden soll, wenn die URL aufgerufen wird
     * @param {boolean} checkLogin_Frontend Login für Frontend prüfen?
     * @param {boolean} checkLogin_Backend Login für Backend prüfen?
     */
    addRoute(type, url, callback, checkLogin_Frontend = false, checkLogin_Backend = false) {
        switch (type) {
            case "get":
                if ( checkLogin_Frontend ) { this.#server.get(this.prefix + url, this.checkLogin_Frontend, callback); }
                else if ( checkLogin_Backend ) { this.#server.get(this.prefix + url, this.checkLogin_Backend, callback); }
                else { this.#server.get(this.prefix + url, callback); }
                break;
            case "post":
                if ( checkLogin_Frontend ) { this.#server.post(this.prefix + url, this.checkLogin_Frontend, callback); }
                else if ( checkLogin_Backend ) { this.#server.post(this.prefix + url, this.checkLogin_Backend, callback); }
                else { this.#server.post(this.prefix + url, callback); }
                break;
        }
    }


    /**
     * Send Data to Twig Template
     * @param {object} req  Website-Request
     * @param {object} res  Website-Response
     * @param {Array} filePath Path to File ( without Filename! )
     * @param {string} fileName Filename (without Path)
     * @param {Array} params Params for Twig Template
     * @param {boolean} isBackend ist die Seite eine "Backend" Seite ? (Wichtig für BasicSite)
     */
    toTwigOutput(req, res, filePath, fileName, params, isBackend ) {
        let _fileName = this.#app.directories.frontend;
        let _altFileName = this.#app.directories.frontend;
        if ( filePath && filePath.length > 0 ) {
            filePath.map(item => { _fileName = path.join(_fileName, item); })
        }

        let tmpFileName = fileName.toLowerCase().replace('.twig', '');
        _fileName = path.join(_fileName, tmpFileName + ".twig");
        _altFileName = path.join(_fileName, tmpFileName + "_custom.twig");

        let basicSite = "";
        let basicSiteCustom = "";
        if ( isBackend ) {
            basicSite = "/base/backend_base.twig";
            basicSiteCustom = "/base/backend_base_custom.twig";
        } else {
            basicSite = "/base/frontend_base.twig";
            basicSite = "/base/frontend_base_custom.twig";
        }

        if ( fs.existsSync(this.#app.directories.frontend + basicSiteCustom)) { params.basicSite = basicSiteCustom; }
        else { params.basicSite = basicSite; }

        if ( fs.existsSync(_altFileName)) { res.render(_altFileName, !params ? {} : params); }
        else { res.render(_fileName, !params ? {} : params); }
    }
}