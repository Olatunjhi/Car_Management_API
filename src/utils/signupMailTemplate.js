// Signup Confirmation Mail Template
const dotenv = require("dotenv");
dotenv.config();

const signupMailTemplate = (name, token) => {
    const verifyUrl = `${process.env.BASE_URL}/verify-email/${token}`;
    return {
      subject: 'Welcome to Car Rental Service!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Car Rental Service!</title>
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
                <h1>🚗 Welcome to Car Rental Service!</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your account has been created successfully. You can now log in after verify your email and start using our services.</p>
                <a href="${verifyUrl}" class="button">Verify Email</a>
                <p>If you did not sign up, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Car Rental Service!
        Hello ${name},
        Your account has been created successfully. You can now log in and start using our services.
        Please verify your email: ${verifyUrl}
        If you did not sign up, please ignore this email.
        Best regards,
        The Car Rental Service Team
      `
    };
}

module.exports = signupMailTemplate;
// Note: The function is exported as a named export for consistency with other mail templates.