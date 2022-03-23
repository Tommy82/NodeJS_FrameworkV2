/**
 * Start des Systemmoduls
 *
 * @module:     Account
 * @version:    1.0
 * @revision:   1
 * @author:     Thomas Göttsching
 * @company:    Thomas Göttsching
 *
 * Wichtiger Hinweis: Änderungen an dieser Datei können die Updatefähigkeit beeinträchtigen.
 * Daher wird dringend davon abgeraten!
 */

import { Functions as fDateTime } from './class.helper.datetime.js';
import { Functions as fLists } from './class.helper.lists.js';
import { Functions as fSecurity } from "./class.helper.security.js";
import { Functions as fConverter } from "./class.helper.converter.js";
import { Functions as fCheck } from "./class.helper.check.js";

export class Functions {
    static dateTime = fDateTime;
    static lists = fLists;
    static security = fSecurity;
    static converter = fConverter;
    static check = fCheck;
}




