import { app } from "../../system/class.app.js";
import { default as Role } from './class.roles.js';

app.web.addRoute("get", "/backend/role", Role.web.getList, false, false);

