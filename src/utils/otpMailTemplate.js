// OTP Mail Template
const otpMailTemplate = (name, otp) => {
    return {
      subject: 'Password Reset Request - Car Rental Service',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: #fff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 3px solid #dc3545; }
                .otp-code { font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px; margin: 10px 0; }
                .warning { background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545; }
                .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>We received a request to reset your password for your Car Rental Service account.</p>
                <div class="otp-box">
                    <h3>Your One-Time Password (OTP):</h3>
                    <div class="otp-code">${otp}</div>
                    <p><small>Enter this code to verify your identity</small></p>
                </div>
                <div class="warning">
                    <h3>⚠️ Important Security Information:</h3>
                    <ul>
                        <li>This OTP is valid for 10 minutes only</li>
                        <li>Never share this code with anyone</li>
                        <li>If you didn't request this reset, ignore this email</li>
                        <li>Contact support if you're experiencing repeated unauthorized attempts</li>
                    </ul>
                </div>
                <p>After verification, you'll be able to set a new password for your account.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The Car Rental Service Security Team</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Car Rental Service
        Hello ${name},
        We received a request to reset your password.
        Your One-Time Password (OTP): ${otp}
        This OTP is valid for 10 minutes only.
        If you didn't request this reset, please ignore this email.
        Best regards,
        The Car Rental Service Security Team
      `
    };
}

module.exports = otpMailTemplate;
// Note: The function is exported as a named export for consistency with other mail templates.