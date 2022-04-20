export const settings = {
    webServer: {
        port: 3000,
        template: 'twig',
        prefix: '',
        sessionKey: 'abc'
    },
    users: {
        init_password: 'LosGehts_123'
    }
}

export const Administrator = {
    username: 'admin',
    password: 'losgehts'
}

export const mail = {
    active: false,
    host: '',
    port: 587,
    secure: false,
    requireTLS: true,
    user: '',
    pass: '',
}


export const database = {
    // Interne Datenbank
    default: {
        type: 'mysql',
        host: '',
        port: 3306,
        user: '',
        pass: '',
        database: '',
    },
    // Xentral Datenbank
    xentral: {
        type: 'mysql',
        host: '',
        port: 3306,
        user: '',
        pass: '',
        database: '',
    }
}