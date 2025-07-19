// Google Signup Confirmation Mail Template
const googleSignupMailTemplate = (name) => {
    return {
        subject: 'Welcome to Car Management!',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Car Management!</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2d7efb 0%, #00c6fb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚗 Welcome to Car Management!</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Thank you for signing up with your Google account.</p>
                <p>We're excited to have you on board. You can now enjoy all the features of our platform seamlessly using your Google credentials.</p>
                <p>If you have any questions or need support, feel free to contact us at <a href="mailto:support@car-management.com" style="color:#2d7ff9; text-decoration:none;">support@car-management.com</a>.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Management Team</p>
            </div>
        </body>
        </html>
        `,
        text: `
        Welcome to Car Management!
        Hello ${name},
        Thank you for signing up with your Google account.
        We're excited to have you on board. You can now enjoy all the features of our platform seamlessly using your Google credentials.
        If you have any questions or need support, feel free to contact us at support@car-management.com.
        Best regards,
        The Car Management Team
        `
    };
};

module.exports = googleSignupMailTemplate;
