/**
 * Hilfsfunktionen für Listen
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

/** Class for List Functions **/
export class Functions {
    static asyncForEach = asyncForEach;
}

/** Async ForEach Loop
 * @param {[]} array Array that should be looped
 * @param {object} callback Single Item of Array
 * @return {Promise<void>}
 */
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
