const nodemailer = require('nodemailer');

exports.registrationMail = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'studentpiwo1@gmail.com',
            pass: 'tajnehaslo123'
        }
    });

    let mailOptions = {
        from: 'studentpiwo1@gmail.com',
        to: req.body.email,
        subject: 'Rejestracja',
        text: 'Gratulacje! Udało Ci się zarejestrować Twoje konto'
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            console.log('Error occured', err);
        }
        else{
            console.log('Email sent')
        }
    })
}