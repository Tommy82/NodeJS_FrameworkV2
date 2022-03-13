//#region Functions - Sync
import {app} from "../../system/class.app.js";
import Role from "./class.roles.js";

export async function syncAll() {
    app.roles = await Role.database.getAll().catch(err => { app.logError(err, Role.moduleName); });
    if ( app.roles ) {
        for ( let i = 0; i < app.roles.length; i++ ) {
            console.log(app.roles[i]);
        }
    }
}
//#endregion Functions - Sync
