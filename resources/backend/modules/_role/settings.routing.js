import { app } from "../../system/class.app.js";
import { default as Role } from './class.role.js';

app.web.addRoute("get", "/backend/role", Role.web.getList, false, false);           // ToDo: Add Backend
app.web.addRoute("get", "/backend/role/:id", Role.web.getDetails, false, false);    // ToDo: Add Backend
app.web.addRoute("post", "/backend/role/:id", Role.web.setDetails, false, false);   // ToDo: Add Backend

