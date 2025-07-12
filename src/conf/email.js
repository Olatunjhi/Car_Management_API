const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (to, subject, html, text) => {
    try {
        // setting up transpoter with SMTP
        const transpoter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: process.env.GMAIL_PORT,
            secure: process.env.GMAIL_SECURE === 'true', // TCL
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        //setting up mail
        const mailOption = {
            from: `Car rental service <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
            text
        };

        await transpoter.sendMail(mailOption);
        console.log('Email sent successfullly');
        return { success: true, message: 'Email sent successfully' };

    } catch (error) {
        console.error('error sending email', error);
        return { success: false, message: error.message};
    }
}

// Exporting the sendEmail function
module.exports = sendEmail;