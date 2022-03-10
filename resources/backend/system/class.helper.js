import { DateTime } from './class.helper.datetime.js';
import { Lists } from './class.helper.lists.js';
import { Security } from "./class.helper.security.js";
import { Converter } from "./class.helper.converter.js";
import { Check } from "./class.helper.check.js";

export default class Helper {
    dateTime = new DateTime();
    lists = new Lists();
    security = new Security();
    converter = new Converter();
    check = new Check();
}




