import { app } from '../../system/class.app.js';
import { default as Rights } from './class.rights.js';

app.web.addRoute("get", "/backend/rights", Rights.web.toList, false, true);
