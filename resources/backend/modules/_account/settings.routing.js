import { app } from "../../system/class.app.js";
import { default as Account } from './class.account.js';

// Login
app.web.addRoute("get", "/backend/login", Account.web.toLogin, false, false);
app.web.addRoute("post", "/backend/login", Account.web.checkLogin, false, false);

// Logout
app.web.addRoute("get", "/backend/logout", Account.web.toLogout, false, true);

// Account
app.web.addRoute("get", "/backend/account", Account.web.toAccountList, false, true);
app.web.addRoute("get", "/backend/account/:id", Account.web.toAccountSingle, false, true);
app.web.addRoute("post", "/backend/account/:id", Account.web.saveAccountSingle, false, true);
