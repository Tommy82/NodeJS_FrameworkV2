import * as fWeb from './functions.web.js';

export default class Home {
    constructor() {
    }

    static web = {
        backend: {
            toHome: fWeb.toHome_backend,
        },
        frontend: {
            toHome: fWeb.toHome_frontend,
        }

    }
}