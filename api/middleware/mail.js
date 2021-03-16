const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'furry.tales.shelter@gmail.com',
        pass: process.env.MAILING_PASS
    }
});

exports.registrationMail = (req, res, next) => {
    let mailOptions = {
        from: 'furry.tales.shelter@gmail.com',
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