// Password Reset Confirmation Template
const passwordResetMailTemplate = (name) => {
    return {
      subject: 'Password Successfully Reset - Car Rental Service',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
                .tips-box { background: #e2e3e5; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✅ Password Reset Successful</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <div class="success-box">
                    <h3>🎉 Your password has been successfully reset!</h3>
                    <p>You can now log in to your Car Rental Service account with your new password.</p>
                </div>
                <div class="tips-box">
                    <h3>💡 Security Tips:</h3>
                    <ul>
                        <li>Use a strong, unique password</li>
                        <li>Don't share your password with anyone</li>
                        <li>Log out from public computers</li>
                        <li>Contact us if you notice any suspicious activity</li>
                    </ul>
                </div>
                <p>Ready to get back on the road? Log in and explore our latest vehicle collection!</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Successful - Car Rental Service
        Hello ${name},
        Your password has been successfully reset!
        You can now log in with your new password.
        Security Tips:
        - Use a strong, unique password
        - Don't share your password with anyone
        - Log out from public computers
        Best regards,
        The Car Rental Service Team
      `
    };
}

module.exports = passwordResetMailTemplate;
// Note: The function is exported as a named export for consistency with other mail templates.