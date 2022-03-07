import { DBAccount } from "./account.entities.js";
import {app} from "../../system/class.app.js";
import Account from "./account.class.js";

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