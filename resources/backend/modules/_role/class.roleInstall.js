import {DBRoles, DBRolesRights} from "./settings.entities.js";
import {app} from "../../system/class.app.js";
import Role from "./class.role.js";

class RoleInstall {
    constructor() { }

    entities = [  DBRoles, DBRolesRights ];

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

        //await Role.sync.all();
    }

    async start() {
        app.frontend.autocomplete.push({ filter: "role", callback: Role.web.autocomplete });

        app.roles = await Role.database.getAll()
            .catch(err => { console.error(err); });

        if ( app.roles && app.roles.length > 0 ) {
            for ( let i = 0; i < app.roles.length; i++ ) {
                app.roles[0].rights = await Role.rights.getAllFromRole(app.roles[i].id).catch(err => { console.error(err); })
            }
        }

        app.helper.check.rights = {
            bySession: checkRightBySession,
            byRole: checkRightByRole,
        }
    }
}

app.addModule(new RoleInstall());

function checkRightBySession(req, moduleName, key) {
    let response = false;
    if ( req && req.session && req.session.user && req.session.user.role ) {
        response = checkRightByRole(req.session.user.role, moduleName, key);
    }
    return response;
}

function checkRightByRole(role, moduleName, key) {
    let response = false;

    let found = app.roles.find(x => x.key === role);
    if ( found ) {
        let foundRight = found.rights.find(x => x.module === moduleName && x.key === key);
        if ( foundRight && (foundRight.allowed === true || foundRight.allowedRole === true )) {
            response = true;
        }
    }

    return response;
}

