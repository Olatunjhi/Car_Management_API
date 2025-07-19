const { google } = require('googleapis');
const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const googleSignupMailTemplate = require('../utils/googleSignupMailTemplate');
const sendEmail = require('../conf/email');
dotenv.config();

const initiateGoogleOAuth =  async (req, res) => {
   try {
     // create OAuth2 client
    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    // generate the URL for authorization
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        include_granted_scopes: true,
        state: json.stringify({
            timestamp: Date.now()
        })
    });

    return res.status(200).json({
        success: true,
        message: 'Google OAuth URL generated successfully',
        authUrl: authUrl
    });
   } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
   }
}

const handleGoogleOAuthCallback = async (req, res) => {
    try {
        const { code, error } = req.query;

        if (error) {
            return res.status(400).json({ message: 'Error during OAuth process', error });
        }

        // Check if code is provided
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is required' });
        }

        // create OAuth2 client
        const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const userInfo = ticket.getPayload();
        const { 
            id: googleId, 
            email, 
            name,
            picture: avatar,
            email_verified: isEmailVerified
        } = userInfo;

        // Check if google email is verified
        if (!isEmailVerified) {
            return res.status(400).json({ message: 'Google email is not verified' });
        }

        // Check if user already exists in the database
        let user = await User.findOne({ googleId });

        if (!user) 
        {

            // Check if email already exists
            const user = await User.findOne({ email });

            if (user)
            {

                // If user exists with email but not with googleId, update the user
                user.googleId = googleId;
                user.avatar = avatar;
                user.provider = 'google';
                user.isEmailVerified = true;
                await user.save();
            } else {
                // Create a new user
                user = new User({
                    name,
                    email,
                    googleId,
                    avatar,
                    isEmailVerified
                });

                // Send Google signup welcome email (if you have a mailer utility, integrate here)
                const mail = googleSignupMailTemplate(name);
                const mailResult = await sendEmail(
                    email, 
                    mail.subject, 
                    mail.html, 
                    mail.text
                );

                if (!mailResult.success)
                {
                    return res.status(500).json({ message: 'Failed to send welcome email' });
                }

                await user.save();
            }
        }

        // Generate JWT token for the user
        const payload = {
            id: user._id,
            email: user.email,
            provider: user.provider,
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        return res.status(200).json({
            success: true,
            message: 'Google OAuth successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            },
            token
        });

    } catch (error) {
        // Handle errors during the OAuth process
        console.error('Error handling Google OAuth callback:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    initiateGoogleOAuth, handleGoogleOAuthCallback
}

