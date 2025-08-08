const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const googleSignupMailTemplate = require('../utils/googleSignupMailTemplate');
const sendEmail = require('../conf/email');
const { google } = require('googleapis');
dotenv.config();

const initiateGoogleOAuth =  async (req, res) => {
   try {
     // create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
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
        state: JSON.stringify({
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

const handleGoogleCallback = async (req, res) => {
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
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        // Get user info from Google
        const { data } = await oauth.userinfo.get();
        console.log(data);

        const { 
            id: googleId, 
            email, 
            name,
            picture: avatar,
            verified_email: emailVerified
        } = data;

        console.log('Google User Data:', name, emailVerified);

        // Check if google email is verified
        if (!emailVerified) {
            return res.status(400).json({ message: 'Google email is not verified' });
        }

        // Check if user already exists in the database
        let user = await User.findOne({ googleId });

        if (!user)
        {
            // Check if email already exists
            user = await User.findOne({ email });

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
                    isEmailVerified: emailVerified,
                    provider: 'google'
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
            name: user.name,
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
        console.log('Error handling Google OAuth callback:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const unlinkGoogleAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and unlink Google account
        const user = await User.findById(userId);
        if (!user) 
        {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.provider !== 'google' || !user.googleId)
        {
            return res.status(400).json({ message: 'User is not linked with Google account' });
        }

        // Unlink Google account
        user.googleId = undefined;
        user.provider = 'local';
        user.avatar = undefined;
        user.isEmailVerified = false;
        await user.save();

        return res.status(200).json({ success: true, message: 'Google account unlinked successfully' });

    } catch (error) {

        // Handle errors during unlinking
        console.error('Error unlinking Google account:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const setGoogleAccountPassword = async (req, res) => {
    try {   
        const userId = req.user.id;
        const { password, comfirmedPassword } = req.body;

        if (!password || !comfirmedPassword)
        {
            return res.status(400).json({ message: 'Password and confirmed password are required' });
        }

        // Validate password
        if (password.length < 6)
        {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if passwords match
        if (comfirmedPassword !== password)
        {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Find the user and set the password
        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.provider !== 'google' && !user.googleId)
        {
            return res.status(400).json({ message: 'User is not linked with Google account' });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password set successfully' });

    }
    catch (error) {

        // Handle errors during setting password
        console.error('Error setting Google account password:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    initiateGoogleOAuth, handleGoogleCallback, unlinkGoogleAccount, setGoogleAccountPassword
}

