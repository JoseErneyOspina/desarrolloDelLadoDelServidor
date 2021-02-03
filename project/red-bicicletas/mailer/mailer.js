const nodemailer = require('nodemailer');
const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dszfks4wymsjsnvio@ethereal.email',
        pass: 'p9xgyUfPqK9yHytusn'
    }
};

module.exports = nodemailer.createTransport(mailConfig);