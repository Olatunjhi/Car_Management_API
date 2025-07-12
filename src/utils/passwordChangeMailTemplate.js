// Password Change Confirmation Template
const passwordChangeMailTemplate = (name) => {
    return {
      subject: 'Password Changed Successfully - Car Rental Service',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed Successfully</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔑 Password Changed Successfully</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <div class="success-box">
                    <h3>Your password has been changed successfully.</h3>
                    <p>If you did not perform this action, please contact support immediately.</p>
                </div>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Password Changed Successfully - Car Rental Service
        Hello ${name},
        Your password has been changed successfully.
        If you did not perform this action, please contact support immediately.
        Best regards,
        The Car Rental Service Team
      `
    };
}

module.exports = passwordChangeMailTemplate;
// Note: The function is exported as a named export for consistency with other mail templates.