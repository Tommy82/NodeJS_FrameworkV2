import { app } from "../../system/class.app.js";
import { Functions as fWeb } from './functions.web.js';

app.web.addRoute("get", "/backend/settings", fWeb.ToList, false, true);
app.web.addRoute("get", "/backend/settings/:id", fWeb.ToDetails, false, true);
app.web.addRoute("post", "/backend/settings/:id", fWeb.FromDetails, false, true);