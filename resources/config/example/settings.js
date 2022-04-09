export const settings = {
    webServer: {
        port: 3000,
        template: 'twig',
        prefix: '',
        sessionKey: 'abc'
    }
}

export const Administrator = {
    username: 'admin',
    password: 'losgehts'
}

export const mail = {
    active: true,
    host: '0',
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