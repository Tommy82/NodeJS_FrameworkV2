import { app } from "../../system/class.app.js";
import {DBRights} from "./settings.entities.js";
import * as fDatabase from './functions.database.js';

export default class Rights {
    static moduleName = 'Rights';

    constructor() {
    }

    static database = {
        getAll: fDatabase.databaseGetAll,
        getByID: fDatabase.databaseGetById,
        getByName: fDatabase.databaseGetByName,
        save: fDatabase.databaseSave
    };
}




class RightsInstall {
    constructor() { }

    entities = [  DBRights ];

    rights = [
        { key: "add", desc: "", defaultRole: "admin" },
        { key: "change", desc: "", defaultRole: "admin" },
    ];

    moduleName = Rights.moduleName;

    async init() {
    }

    async install() {
        //#region Installation - Alle Rechte aus allen Modulen
        app.log("Installation / Update - Rechte", this.moduleName);
        let orgRights = await Rights.database.getAll(false).catch(err => { app.logError(err, Rights.moduleName); });
        if ( app.modules && app.modules.length > 0 ) {
            await app.helper.lists.asyncForEach(app.modules, async (module) => {
                if ( module && module.rights && module.rights.length > 0 ) {
                    await app.helper.lists.asyncForEach(module.rights, async (right) => {
                        let found = orgRights.find(x => x.moduleName === module.moduleName && x.key === right.key);
                        if ( !found ) {
                            let document = {
                                id: 0,
                                moduleName: module.moduleName,
                                key: right.key,
                                desc: right.desc,
                                defaultRole: right.defaultRole
                            }
                            await Rights.database.save(document).catch(err => { app.logError(err, "RightInstall"); });
                        }
                    });
                }
            })
        }
        //#endregion Installation - Alle Rechte aus allen Modulen
    }

    async start() {
        app.rights = await Rights.database.getAll(false);
    }
}

app.addModule(new RightsInstall());