import { app } from './resources/backend/system/class.app.js';

//#region Import Modules
import './resources/backend/modules/_account/_index.js';
import './resources/backend/modules/_rights/_index.js';
import './resources/backend/modules/_role/_index.js';
//#endregion Import Modules

app.init(); // Initialisierung der App (inklusive Installation und Starten!)

