import { app } from "../../system/class.app.js";
import { default as Role } from './class.role.js';

app.web.addRoute("get", "/backend/role", Role.web.getList, false, true);
app.web.addRoute("get", "/backend/role/:id", Role.web.getDetails, false, true);
app.web.addRoute("post", "/backend/role/:id", Role.web.setDetails, false, true);

