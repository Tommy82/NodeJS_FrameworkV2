export default class Helper {
    dateTime = new DateTime();
    lists = new Lists();
    security = new Security();
    converter = new Converter();
}


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

//#region Converter
export class Converter {
    male_female = male_female;
}

/** Calculate the "Male" or "Female" from the FirstName
 * @param {string} firstName FirstName
 */
function male_female(firstName) {

    let lstBoth = ["Alex","Alexis","Andrea","Auguste","Carol","Chris","Conny","Dominique","Eike","Folke","Francis","Friedel","Gabriele","Gerke","Gerrit","Heilwig","Jean","Kay","Kersten","Kim","Kimberly","Leslie","Luca","Lucca","Luka","Maris","Maxime","Nicki","Nicola","Nikola","Sandy","Sascha","Toni","Winnie"]
    let lstMale2 = ["ai","an","ay","dy","en","eu","ey","fa","gi","hn","iy","ki","nn","oy","pe","ri","ry","ua","uy","we","zy"];
    let lstMale3 = ["ael","ali","aid","ain","are","ave","bal","bby","bin","cal","cel","cil","cin","die","don","dre","ede","edi","eil","eit","emy","eon","gon","gun","hal","hel","hil","hka","iel","iet","ill","ini","kie","lge","lon","lte","lja","mal","met","mil","min","mon","mre","mud","muk","nid","nsi","oah","obi","oel","örn","ole","oni","oly","phe","pit","rcy","rdi","rel","rge","rka","rly","ron","rne","rre","rti","sil","son","sse","ste","tie","ton","uce","udi","uel","uli","uke","vel","vid","vin","wel","win","xei","xel"]
    let lstMale4 = ["abel","akim","amie","ammy","atti","bela","didi","dres","eith","elin","emia","erin","ffer","frid","gary","gene","glen","hane","hann","hein","idel","iete","irin","kind","kita","kola","lion","levi","llin","mann","mika","mike","muth","naud","neth","nnie","ntin","nuth","olli","ommy","onah","önke","ören","pete","rene","ries","rlin","rome","rren","rtin","ssan","stas","tell","teve","tila","tony","tore","uele"]
    let lstMale5 = ["astel","benny","billy","billi","brosi","elice","ianni","laude","lenny","danny","dolin","ormen","pille","ronny","urice","ustel","ustin","willi","willy"]
    let lstMale6 = ["jascha","tienne","urence","vester"];
    let lstMale7 = ["patrice"];
    let lstFemale1 = ["a","e","i","n","u","y"];
    let lstFemale2 = ["ah","al","bs","dl","el","et","id","il","it","ll","th","ud","uk"];
    let lstFemale3 = ["ann","ary","aut","des","een","eig","eos","ett","fer","got","ies","iki","ild","ind","itt","jam","joy","kim","lar","len","lis","men","mor","oan","ppe","ren","res","rix","san","sey","sis","tas","udy","urg","vig"];
    let lstFemale4 = ["ahel","ardi","atie","borg","cole","endy","gard","gart","gnes","gund","iede","indy","ines","iris","ison","istl","ldie","lilo","loni","lott","lynn","mber","moni","nken","oldy","riam","riet","rill","roni","smin","ster","uste","vien"];
    let lstFemale5 = ["achel","agmar","almut","Candy","Doris","echen","edwig","gerti","irene","mandy","nchen","paris","rauke","sabel","sandy","silja","sther","trudi","uriel","velin","ybill"];
    let lstFemale6 = ["almuth","amaris","irsten","karien","sharon"];

    let last = [];
    for ( let i = 1; i <= firstName.length; i++ ) {
        if ( firstName.length >= i ) {
            last[i] = firstName.substring(firstName.length -i, firstName.length);
        }
    }

    let both = lstBoth.includes(firstName) ? 1 : 0;
    let male2 = firstName.length >= 2 ? (lstMale2.includes(last[2]) ? -1 : 0) : 0;
    let male3 = firstName.length >= 3 ? (lstMale3.includes(last[3]) ? -1 : 0) : 0;
    let male4 = firstName.length >= 4 ? (lstMale4.includes(last[4]) ? -1 : 0) : 0;
    let male5 = firstName.length >= 5 ? (lstMale5.includes(last[5]) ? -1 : 0) : 0;
    let male6 = firstName.length >= 6 ? (lstMale6.includes(last[6]) ? -1 : 0) : 0;
    let male7 = firstName.length >= 7 ? (lstMale7.includes(last[7]) ? -1 : 0) : 0;
    let female1 = firstName.length >= 1 ? (lstFemale1.includes(last[1]) ? 1 : 0) : 0;
    let female2 = firstName.length >= 2 ? (lstFemale2.includes(last[2]) ? 1 : 0) : 0;
    let female3 = firstName.length >= 3 ? (lstFemale3.includes(last[3]) ? 1 : 0) : 0;
    let female4 = firstName.length >= 4 ? (lstFemale4.includes(last[4]) ? 1 : 0) : 0;
    let female5 = firstName.length >= 5 ? (lstFemale5.includes(last[5]) ? 1 : 0) : 0;
    let female6 = firstName.length >= 6 ? (lstFemale6.includes(last[6]) ? 1 : 0) : 0;

    let male = male2 - male3 - male4 - male5 - male6 - male7; // Calc male as "-"
    let female = female1 + female2 + female3 + female4 + female5 + female6 + male; // Calc "female" as "+"

    let response = {
        firstName: firstName,
        both: false,
        female: false,
        male: false,
        toString: '',
    }
    if ( firstName && firstName !== "" ) {
        if ( both === 1 ) { response.both = true; }
        if ( female === 0 ) { response.male = true } else { response.female = true; }

        if ( response.both === true ) {
            if ( response.female ) { response.toString = 'both (female)' } else { response.toString = 'both (male)'; }
        } else {
            if ( response.female ) { response.toString = 'female'; }
            else { response.toString = 'male'; }
        }
    }
    return response;
}//#endregion Converter