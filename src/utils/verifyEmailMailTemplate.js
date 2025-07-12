// Email Verification Success Template

const emailVerifySuccess = (name) => {
    return {
      subject: 'Email Verified Successfully - Car Rental Service',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📧 Email Verified Successfully</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your email address has been verified. You can now enjoy full access to your Car Rental Service account.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Email Verified Successfully - Car Rental Service
        Hello ${name},
        Your email address has been verified. You can now enjoy full access to your Car Rental Service account.
        Best regards,
        The Car Rental Service Team
      `
    };
}

module.exports = emailVerifySuccess;
// Note: The function is exported as a named export for consistency with other mail templates.