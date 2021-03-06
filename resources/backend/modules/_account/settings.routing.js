/**
 * Routing funktionen des Moduls [Account]
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
import { default as Account } from './class.account.js';

//#region Login
// Aufruf - Backend - Login Formular
app.web.addRoute("get", "/backend/login", Account.web.toLogin, false, false);
// Prüfen ob Anmeldedaten korrekt und Anmeldung
app.web.addRoute("post", "/backend/login", Account.web.checkLogin, false, false);
//#endregion Login

//#region ForgotPassword
app.web.addRoute("get", "/backend/forgot", Account.web.toForgot, false, false);
app.web.addRoute("post", "/backend/forgot", Account.web.saveForgot, false, false);
//#endregion ForgotPassword

// Logout - Abmeldung des Benutzers aus Frontend und Backend
app.web.addRoute("get", "/backend/logout", Account.web.toLogout, false, true);

//#region Account
// Aufruf der Account liste
app.web.addRoute("get", "/backend/account", Account.web.toAccountList, false, true);
// Aufruf eines einzelnen Accounts zur Bearbeitung
app.web.addRoute("get", "/backend/account/:id", Account.web.toAccountSingle, false, true);
// Senden der geänderten Accountdaten
app.web.addRoute("post", "/backend/account/:id", Account.web.saveAccountSingle, false, true);
// Löschen der AccountDaten
app.web.addRoute("get", "/backend/account/:id/del", Account.web.delAccountSingle, false, true);
app.web.addRoute("get", "/backend/account/:id/me", Account.web.toMe, false, true);
app.web.addRoute("post", "/backend/account/:id/me", Account.web.saveMe, false, true);
//#endregion Account