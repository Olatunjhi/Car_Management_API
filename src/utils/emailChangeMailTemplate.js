const dotenv = require("dotenv");
dotenv.config();

const emailChangeMailTemplate = (name, token) => {
    const verifyUrl = `${process.env.BASE_URL}/verify-email/${token}`;
    return {
      subject: 'Changing Of Email Request!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Changing Of Email Request!</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2d7efb 0%, #00c6fb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 15px 30px; background: #17a2b8; color: #fff; border-radius: 6px; text-decoration: none; font-size: 18px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚗 Change Of Email Request!</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your request for changing email is created successfully. Verify your new email and continue using our services.</p>
                <a href="${verifyUrl}" class="button">Verify Email</a>
                <p>If you did not request for this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Change Of Email Request!
        Hello ${name},
        Your request for changing email is created successfully. Verify your new email and continue using our services.
        Please verify your email: ${verifyUrl}
        If you did not request for this, please ignore this email.
        Best regards,
        The Car Rental Service Team
      `
    };
}

module.exports = emailChangeMailTemplate;