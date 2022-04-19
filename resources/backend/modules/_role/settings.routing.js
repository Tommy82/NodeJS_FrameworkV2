/**
 * Routing funktionen des Moduls [Role]
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

import { app } from "../../system/class.app.js";
import { default as Role } from './class.role.js';

// Ausgabe - Liste aller Rollen
app.web.addRoute("get", "/backend/role", Role.web.getList, false, true);

// Ausgabe - Einzeldetails einer Rolle
app.web.addRoute("get", "/backend/role/:id", Role.web.getDetails, false, true);

// Speichern - Einzeldetails einer Rolle
app.web.addRoute("post", "/backend/role/:id", Role.web.setDetails, false, true);

app.web.addRoute("get", "/backend/role/:id/del", Role.web.delete, false, true);