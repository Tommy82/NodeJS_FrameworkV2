import { app } from './resources/backend/system/class.app.js';

//#region Import Modules
import './resources/backend/modules/_account/_index.js';
import './resources/backend/modules/_home/_index.js';
import './resources/backend/modules/_rights/_index.js';
import './resources/backend/modules/_role/_index.js';
//#endregion Import Modules

// Import Custom Module
import './index_custom.js';

app.init(); // Initialisierung der App (inklusive Installation und Starten!)

