import {DBAccount} from "./settings.entities.js";
import {app} from "../../system/class.app.js";
import Account from "./class.account.js";
import { Administrator } from "../../../config/settings.js";

class AccountInstall {
    constructor() { }

    entities = [  DBAccount ];

    rights = [
        { key: "add", desc: "", defaultRole: "admin" },
        { key: "change", desc: "", defaultRole: "admin" },
        { key: "delete", desc: "", defaultRole: "admin" },
    ];

    moduleName = Account.moduleName;

    async init() {
    }

    async install() {
    }

    async start() {
        if ( Administrator.username && Administrator.username != "" && Administrator.password && Administrator.password != "") {
            Account.database.getByName(Administrator.username)
                .then(async data => {
                    let document = {
                        id: data && data.length > 0 ? data[0].id : 0,
                        name: Administrator.username,
                        password: await app.helper.security.hashPassword(Administrator.password),
                        active: 1,
                        isBackend: 1,
                        isFrontend: 1,
                        mustChange: 0,
                        email: '',
                        roles: 'admin'
                    };
                    Account.database.save(document)
                        .then(data => { app.log("Administrator Account Updated", Account.moduleName); })
                        .catch(err => { app.logError(err, Account.moduleName); })
                })
                .catch(err => { app.logError(err, Account.moduleName); })
        }
    }
}
app.addModule(new AccountInstall());