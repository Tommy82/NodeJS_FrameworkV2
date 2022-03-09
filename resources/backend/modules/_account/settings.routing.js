import { app } from "../../system/class.app.js";
import { default as Account } from './class.account.js';

app.web.addRoute("get", "/backend/login", Account.web.toLogin, false, false);
app.web.addRoute("get", "/backend/account", Account.web.toAccountList, false, true);
app.web.addRoute("get", "/backend/account/:id", Account.web.toAccountSingle, false, true);

