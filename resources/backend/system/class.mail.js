import { default as nodemailer } from 'nodemailer';
import { mail } from '../../config/settings.js';

export default class Functions {
    static sendMail = sendMail;
}

function sendMail(to, subject, text = null, html = null) {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: mail.host,
                port: mail.port,
                secure: mail.secure,
                requireTLS: mail.requireTLS,
                auth: {
                    user: mail.user,
                    pass: mail.pass
                }
            });

            let mailOptions = {
                from: mail.user,
                to: to,
                subject: subject,
                text: text && text != '' ? text : null,
                html: html && html != '' ? html : null,
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) { return reject(error); }
                else { return resolve(true); }
            });
        } catch ( err ) {
            return reject(err);
        }
    })
}

