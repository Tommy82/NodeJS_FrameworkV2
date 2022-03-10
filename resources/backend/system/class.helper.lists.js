//#region Lists
/** Class for List Functions **/
export class Lists {
    asyncForEach = asyncForEach;
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
//#endregion Lists