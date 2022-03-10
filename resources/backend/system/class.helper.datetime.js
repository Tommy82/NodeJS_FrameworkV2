

//#region DateTime

/** Class fpr DateTime Functions */
export class DateTime {
    getCurrentDateTime = getCurrentDateTime;
    toRealString = toRealString;
    toRealUTCString = toRealUTCString;
}

/** get the current DateTime and UTC-DateTime
 * @return {{utcMonth: number, utcMinutes: number, year: number, minutes: number, utcYear: number, utcDay: number, seconds: number, month: number, hour: number, utcSeconds: number, utcMilliSeconds: number, day: number, utcHours: number, milliSeconds: number}}
 */
function getCurrentDateTime() {
    let date_ob = new Date();

    return {
        year: date_ob.getFullYear(),
        month: parseInt(("0" + (date_ob.getMonth() + 1)).slice(-2)),
        day: parseInt(("0" + date_ob.getDate()).slice(-2)),
        hour: date_ob.getHours(),
        minutes: date_ob.getMinutes(),
        seconds: date_ob.getSeconds(),
        milliSeconds: date_ob.getMilliseconds(),

        utcYear: date_ob.getUTCFullYear(),
        utcMonth: date_ob.getUTCMonth(),
        utcDay: date_ob.getUTCDate(),
        utcHours: date_ob.getUTCHours(),
        utcMinutes: date_ob.getUTCMinutes(),
        utcSeconds: date_ob.getUTCSeconds(),
        utcMilliSeconds: date_ob.getUTCMilliseconds(),

        realString: toRealString(date_ob),
        realUTCString: toRealUTCString(date_ob),

        toDateString: date_ob.toDateString,
        toISOString: date_ob.toISOString,
        toLocaleDateString: date_ob.toLocaleDateString,
        toLocaleString: date_ob.toLocaleString,
        toLocaleTimeString: date_ob.toLocaleTimeString,
        toString: date_ob.toString,
        toTimeString: date_ob.toTimeString,
        toUTCString: date_ob.toUTCString,
    }
}

/** Convert the Timestamp to a real DateTime String with Format "yyyy-MM-dd hh:mm:ss"
 * @param {object} date_ob Timestamp
 * @return {string} Real Timestamp - DateString
 */
function toRealString(date_ob) {

    if (!date_ob) {
        date_ob = new Date();
    }

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

/** Convert the Timestamp to a real UTC DateTime String with Format "yyyy-MM-dd hh:mm:ss"
 * @param date_ob
 * @return {string}
 */
function toRealUTCString(date_ob) {
    if (!date_ob) {
        date_ob = new Date();
    }
    let date = ("0" + date_ob.getUTCDate()).slice(-2);
    let month = ("0" + (date_ob.getUTCMonth() + 1)).slice(-2);
    let year = date_ob.getUTCFullYear();
    let hours = date_ob.getUTCHours();
    let minutes = date_ob.getUTCMinutes();
    let seconds = date_ob.getUTCSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "Z";
}
//#endregion DateTime