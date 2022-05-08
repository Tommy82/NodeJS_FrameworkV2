import { app } from "../../system/class.app.js";
import { DBSettings } from "./settings.entities.js";
import Settings from "./class.settings.js";

class SettingsInstall {
    constructor() {
    }

    moduleName = Settings.moduleName;

    entities = [ DBSettings ];

    rights = [
        { key: 'change', desc: "Einstellung ändern", defaultRole: "admin" }, // Einstellung ändern
    ];

    async init() {
        app.modules.settings = Settings;
    }

    async install() {
    }

    async start() {
    }
}

app.addInstallModule(new SettingsInstall);