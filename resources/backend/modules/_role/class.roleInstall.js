import {DBRoles} from "./settings.entities.js";
import {app} from "../../system/class.app.js";
import Role from "./class.roles.js";

class RoleInstall {
    constructor() { }

    entities = [  DBRoles ];

    rights = [
        { key: "add", desc: "", defaultRole: "admin" },
        { key: "change", desc: "", defaultRole: "admin" },
        { key: "delete", desc: "", defaultRole: "admin" },
    ];

    moduleName = Role.moduleName;

    async init() {
    }

    async install() {
        await Role.sync.all();

        let basicRoles = [
            { key: "admin", name: "Administrator", desc: "" },
        ]

        app.helper.lists.asyncForEach(basicRoles, async (role) => {
            let found = app.roles.find(x => x.key === role.key);
            if ( !found ) {
                let document = {
                    id: 0,
                    key: role.key,
                    desc: role.desc,
                    name: role.name
                };
                await Role.database.save(document).catch(err => { app.logError(err, Role.moduleName); })
            }
        })

        await Role.sync.all();
    }

    async start() {
        app.frontend.autocomplete.push({ filter: "role", callback: Role.web.autocomplete });
    }
}

app.addModule(new RoleInstall());



