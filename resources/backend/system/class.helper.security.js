//#region Security
import bcrypt from 'bcryptjs';

export class Security {
    hashPassword = hashPassword;
    comparePassword = comparePassword;
}

/** Encrypt a Password by bcrypt and returns the Hash
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

/** Check if Password is correct
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
//#endregion Security