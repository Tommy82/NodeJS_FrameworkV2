export const settings = {
    webServer: {
        port: 3000,
        template: 'twig',
        prefix: '',
        sessionKey: 'abc'
    }
}

export const database = {
    // Interne Datenbank
    default: {
        type: 'mysql',
        host: 'thomasgoettsching.de',
        port: 3306,
        user: 'xentraldb',
        pass: 'y5xfC&16',
        database: 'xentral_manage',
    },
    // Xentral Datenbank
    xentral: {
        type: 'mysql',
        host: 'thomasgoettsching.de',
        port: 3306,
        user: 'xentraldb',
        pass: 'y5xfC&16',
        database: 'xentral',
    }
}