/**
 * Hilfsfunktionen für Sicherheitsfeatures
 *
 * @module:     System
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import bcrypt from 'bcryptjs';

export class Functions {
    static hashPassword = hashPassword;
    static comparePassword = comparePassword;
}

/**
 * Codiert ein Password via "bcrypt" und gibt den Hash zurück
 * @param {string} password Normal Password
 * @return {Promise<string>} crypt Password | Hash
 */
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12)
            .catch ( err => { return reject(err); })
            .then( hash => { return resolve(hash); })
    })
}

/**
 * Prüft, ob ein Kennwort korrekt ist
 * @param {string} password Normal Password that User inputs
 * @param {string} hash Crypt Password from Database
 * @return {Promise<boolean>}
 */
async function comparePassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash)
            .catch ( err => { return reject(err); })
            .then( state => { return resolve(state); })
    })
}
