const nodemailer = require("nodemailer");

const sendToken = async (email, subject, text) => {
    try {


        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qadeerasghar631@gmail.com',
            pass: 'gzflpkuuklwmevrm'
        }
        });

        await transporter.sendMail({
            from: 'qadeerasghar631@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
}

module.exports = sendToken;
