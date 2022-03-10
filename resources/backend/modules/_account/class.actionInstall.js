import {DBAccount} from "./settings.entities.js";
import {app} from "../../system/class.app.js";
import Account from "./class.account.js";

class AccountInstall {
    constructor() { }

    entities = [  DBAccount ];

    rights = [ ];

    moduleName = Account.moduleName;

    async init() {
    }

    async install() {
    }

    async start() {
    }
}
app.addModule(new AccountInstall());