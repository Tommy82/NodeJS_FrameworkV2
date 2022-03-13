import {app} from "../../system/class.app.js";
import { default as Home } from './class.home.js';

// Route - Hauptseite - Backend
app.web.addRoute("get", "/backend", Home.web.backend.toHome, false, true);

// Route - Hauptseite - Frontend
app.web.addRoute("get", "/", Home.web.frontend.toHome, false, false);
