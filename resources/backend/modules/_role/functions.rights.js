import { default as Rights } from '../_rights/class.rights.js';
import { default as Role } from './class.role.js';
import * as fDB from './functions.database.js';

/**
 * Lädt alle Rechte einer Rolle
 * @param {int} id Interne ID der Rolle (db:role.id)
 * @constructor
 */
export function GetAllFromRole(id) {
    return new Promise((resolve, reject) => {

        // Lade Rolle
        Role.database.getByID(id)
            .then(role => {
                if ( role && role.length > 0 ) {
                    role = role[0];
                    role.rights = [];

                    // Lade alle Rechte
                    Rights.database.getAll(false)
                        .then(lstRights => {
                            if ( lstRights && lstRights.length > 0 ) {
                                lstRights.forEach(item => {
                                    let found = role.rights.find(x => x.module === item.moduleName && x.key === item.key);
                                    if ( !found ) {
                                        role.rights.push({
                                            module: item.moduleName,
                                            key: item.key,
                                            allowed: false,
                                            allowedRole: item.defaultRole === role.key ? true : false,
                                            roleID: role.id,
                                            rightID: item.id
                                        });
                                    }
                                    else {
                                        found.allowedRole = item.defaultRole === role.key ? true : false;
                                    }
                                })
                            }

                            // Laden aller Rollenbedingten Rechte
                            fDB.databaseRightsGetAll(id)
                                .then(lstRoleRights => {
                                    if ( lstRoleRights && lstRoleRights.length > 0 ) {
                                        lstRoleRights.forEach(item => {
                                            let found = role.rights.find(x => x.roleID === item.roleID && x.rightID === item.rightID);
                                            if ( found ) {
                                                found.allowed = item.allowed === 1 || item.allowed === '1' ? true : false;
                                            }
                                        });
                                    }
                                    return resolve(role.rights);
                                })
                                .catch(err => { return reject(err); })

                        })
                        .catch(err => { return reject(err); })
                } else {
                    return reject("Role not found");
                }
            })
            .catch(err => { return reject(err); })

    })
}