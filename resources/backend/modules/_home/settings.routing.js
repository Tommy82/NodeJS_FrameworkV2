import {app} from "../../system/class.app.js";
import { default as Home } from './class.home.js';

app.web.addRoute("get", "/backend", Home.web.backend.toHome, false, true);

app.web.addRoute("get", "*", Home.web.frontend.toHome, false, false);
