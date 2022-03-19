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
                    Rights.database.getAll(true)
                        .then(lstRights => {
                            if ( lstRights && lstRights.length > 0 ) {
                                lstRights.forEach(item => {
                                    if ( item.defaultRole === role.key ) {
                                        let found = role.rights.find(x => x.module === item.moduleName && item.key === item.key);
                                        if ( !found ) { role.rights.push({ module: item.moduleName, key: item.key, allowed: false, allowedRole: true }); }
                                        else { found.allowedRole = true; }
                                    }
                                })
                            }

                            // Laden aller Rollenbedingten Rechte
                            fDB.databaseRightsGetAll(id)
                                .then(lstRoleRights => {
                                    //console.log(role);
                                    //console.log(lstRights);
                                    //console.log(lstRoleRights);
                                    return resolve(role);
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