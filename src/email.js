const nodemailer = require('nodemailer');

const sendEmail = async options => {

    // 1)Create a Transporter

    const transporter = nodemailer.createTransport({
        
        host: process.env.Email_Host,
        port:process.env.Email_Port,
        auth:{
            user:process.env.Email_Username,
            pass:process.env.Email_Password
        }
        //Activate in gmail "Less secure app" options
    })

    // 2)define email options

    const mailoptions = {
        from: 'Hunny <hunnympi@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message

    }

    // 3)Actually send the email

    await transporter.sendMail(mailoptions);
}

module.exports = sendEmail;