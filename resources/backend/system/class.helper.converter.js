/**
 * Hilfsfunktionen zum Konvertieren von Daten
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

export class Functions {
    static male_female = male_female;
    static replaceAll = replaceAll;
    static valueForSQL = valueForSQL;
}

/**
 * Prüft, ob der Vorname ein "männlicher", "weiblicher" oder "beides" möglich ist
 * @param {string} firstName Vorname
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

/**
 * Ersetzt alle Zeichen eines Abschnitts innerhalb eines Stings
 * @param {string} str Kompletter Text
 * @param {string} find Abschnitt, welcher ersetzt werden soll
 * @param {string} replace Abschnitt, womit ersetzt werden soll
 * @returns {string}
 */
function replaceAll(str, find, replace) {
    let escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

function valueForSQL(type, col, value) {
    let response = "";

    if ( type === "insert" ) {
        response += ` \`${col.key}\` = `;
    }

    switch ( col.type ) {
        case 'checkbox':
            value = value && value === 'on' ? '1' : '0';
            if ( value === undefined ) { value = '0'; }
            response += ` ${value} `;
            break;
        case 'integer':
            response += ` ${parseInt(value)} `;
            break;
        case 'float':
            response += ` ${parseFloat(value)} `;
            break;
        case 'double':
            response += ` ${parseFloat(value)} `;
            break;
        default:
            response += ` '${value}' `;
            break;
    }
    return response;
}