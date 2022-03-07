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
import methodOverride from 'method-override';
import Twig from 'twig';

export default class ClassWebserver {
    server = undefined;
    isOnline = false;
    prefix = '';
    router;

    constructor(app) {
        this.server = express();

        this.server.use(express.static(app.directories.frontend));

        //#region Engine
        this.server.engine('twig', Twig.__express);
        this.server.set('view-engine', 'twig');
        this.server.set('views', app.directories.frontend);
        this.server.set('twig options', {});
        this.server.set('view options', { layout: false});
        //#endregion Engine

        //#region Prefix
        this.prefix = app.settings.webServer.prefix;
        if ( this.prefix && this.prefix !== '' ) {
            this.router = new express.Router();
            this.router.use = new express.Router();
            this.server.use(this.prefix, express.static(app.directories.frontend));
            this.server.use(this.prefix, this.router);
        }
        //#endregion Prefix

        this.server.use(express.urlencoded({extended: false})); // Set Url Encoding
        this.server.use(flash());                                      // Include Flash to set direct Messages on HTML Form
        this.server.use(session({                               // Set ClassWebserver Session
            secret: app.settings.webServer.sessionKey,
            resave: false,
            saveUninitialized: false
        }));
        this.server.use(methodOverride('_method'));              // Allow Method Override
        this.server.listen(app.settings.webServer.port);                   // Start ClassWebserver with Port given in Settings File
        this.isOnline = true;                                          // Set Internal Parameter to true, so Modules that initialize later can see that Server is online

    }
}