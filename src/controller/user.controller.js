const User = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const sendEmail = require('../conf/email');
const otpMailTemplate = require('../utils/otpMailTemplate');
const passwordResetMailTemplate = require('../utils/passwordResetMailTemplate');
const signupMailTemplate = require('../utils/signupMailTemplate');
const emailVerifySuccess = require('../utils/verifyEmailMailTemplate');
const passwordChangeMailTemplate = require('../utils/passwordChangeMailTemplate');

dotenv.config();
const saltRounds = parseInt(process.env.SALT_ROUND);
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password)
        {
           return res.status(400).json({message: 'All field are required'});
        }

        if (password.length < 6)
        {
            return res.status(400).json({message: '6 minimum characters for password'});
        }

        const existingUser = await User.findOne({ email });

        if (existingUser)
        { 
            return res.status(400).json({message: 'User already exists', existingUser});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword });
        
        // Generate a unique email token
        newUser.emailToken = uuidv4();

        // Send signup confirmation email with verify button
        const mail = signupMailTemplate(newUser.name, newUser.emailToken);
        const emailResult = await sendEmail(
            email,
            mail.subject,
            mail.html,
            mail.text
        );

        if (!emailResult.success)
        {
            return res.status(500).json({message: 'Failed to send signup comfirmation email'});
        }

        await newUser.save();

        // Return success response
        return res.status(201).json({message: 'Sign up successful', newUser});
    } catch (error) {
        console.error('error signing up', error);

        return res.status(500).json({
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Unexpected error occured. Please try again later"
        })
    }
}

const verifyEmail = async (req, res) => {
    const { emailToken } = req.params;
    try {
        const user = await User.findOne({ emailToken });

        // Check if the user exists
        if (!user)
        {
            return res.status(404).json({message: 'User not found'});
        }
        
        // Check if the email token is provided
        if (!emailToken)
        {
            return res.status(400).json({message: 'Email token is required'});
        }

        // Check if the email token matches
        if (user.emailToken !== emailToken)
        {
            return res.status(400).json({message: 'Invalid email token'});
        }

        // Check if the email is already verified
        if (user.isEmailVerified)
        {
            return res.status(400).json({message: 'Email already verified'});
        }
        user.isEmailVerified = true;
        user.emailToken = null; // Clear the email token after verification
        
        // Send email verification success email
        const mail = emailVerifySuccess(user.name);
        const emailResult = await sendEmail(
            user.email,
            mail.subject,
            mail.html,
            mail.text
        );

        if (!emailResult.success)
        {
            return res.status(500).json({message: 'Failed to send verification success email'});
        }

        await user.save();

        // Return success response
        return res.status(200).json({message: 'Email verified successfully'});

    } catch (error) {
        console.error('error verifying email', error);
        return res.status(500).json({
            "error": 
            {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
        {
            return res.status(400).json({message: 'All fields are require'});
        }

        const userExists = await User.findOne({ email });

        if (!userExists)
        {
            return res.status(404).json({message: 'User does not exist'});
        }

        if (!userExists.isEmailVerified)
        {
            return res.status(401).json({message: 'Please verify your email before logging in'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

        if (!isPasswordCorrect)
        {
            return res.status(401).json({message: 'Incorrect password'});
        }

        const payload = {
            id: userExists._id,
            email: userExists.email
        }

        const token = await jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration});

        return res.status(200).json({message: 'User login successfully', userExists, token});

    } catch (error) {
        console.error('error login', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected error occured. Please try agian later"
            }
        })
    }
}

const admin = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user)
        {
            return res.status(404).json({message: 'User cannot be found'});
        }
        user.isAdmin = true;
        user.save();

        return res.status(200).json({message: 'User made admin successful', user});
    } catch (error) {
        console.error('error making admin', error);

        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected error occured. Please try again later"
            }
        })
    }
}

const changePassword = async (req, res) => {
    const { previousPassword, newPassword, comfirmedPassword } = req.body;
    const { userId } = req.params;

    try {
        if (!previousPassword || !newPassword || !comfirmedPassword)
        {
            return res.status(404).json({message: 'All fields are required'});
        }

        const user = await User.findById(userId);
        const isPreviousPasswordValid = await bcrypt.compare(previousPassword, user.password);

        if (!isPreviousPasswordValid)
        {
            return res.status(400).json({message: 'Previous password incorrect'});
        }

        if (newPassword.length < 6)
        {
            return res.status(400).json({message: 'Minimum of 6 characters for password'});
        }

        if (newPassword !== comfirmedPassword)
        {
            return res.status(400).json({message: 'New password and comfirmed password do not match'});
        }

        if (newPassword == previousPassword)
        {
            return res.status(400).json({message: 'Previous password can not be new password'});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;

        // Send password change confirmation email
        const mail = passwordChangeMailTemplate(user.name);
        const emailResult = await sendEmail(
            user.email,
            mail.subject,
            mail.html,
            mail.text
        );

        if (!emailResult.success)
        {
            return res.status(500).json({message: 'Failed to send password change confirmation email'});
        }

        await user.save();

        // Return success response
        return res.status(200).json({message: 'Password changed successfully'});

    } catch (error) {
        console.error('error changing password', error);

        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected error occured. Please try again later"
            }
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(404).json({message: 'User does not exist'});
        }

        const otp = await Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;

        // Send OTP email
        const mail = otpMailTemplate(user.name, otp);
        const emailResult = await sendEmail(
            email,
            mail.subject,
            mail.html,
            mail.text
        );

        if (!emailResult.success)
        {   
            return res.status(500).json({message: 'Failed to send OTP email'});
        }

        await user.save();

        return res.status(200).json({message: 'OTP sent to your email. Please check your inbox.'});

    } catch (error) {
        console.error('error forgotting password', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again."
            }
        })
    }
}

const verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ otp });

        if (otp !== user.otp)
        {
            return res.status(400).json({message: 'Invalid OTP!'});
        }

        user.isOtpVerified = true;
        user.otp = null;
        await user.save();

        return res.status(200).json({message: 'You can now set a new password'});

    } catch (error) {
        console.error('error verifying otp', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

const resetPassword = async (req, res) => {
    const { newPassword, comfirmedPassword } = req.body;
    const { userId } = req.params;
    if (!newPassword || !comfirmedPassword)
    {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        if (newPassword !== comfirmedPassword)
        {
            return res.status(400).json({message: 'Password does not matched'});
        }

        const user = await User.findById(userId);
        if (!user)
        {
            return res.status(404).json({message: 'User does not exist'});
        }

        if (user.isOtpVerified !== true)
        {
            return res.status(401).json({message: 'OTP failed to verified'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        user.isOtpVerified = false;

        // Send password reset confirmation email
        const mail = passwordResetMailTemplate(user.name);
        const emailResult = await sendEmail(
            user.email,
            mail.subject,
            mail.html,
            mail.text
        );

        if (!emailResult.success)
        {
            return res.status(500).json({message: 'Failed to send password reset confirmation email'});
        }

        await user.save();

        return res.status(201).json({message: 'Reset password successfully'});
        
    } catch (error) {
        console.error('error resetting password', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

module.exports = {
    signup, login, admin, changePassword, forgotPassword, verifyOtp, resetPassword, verifyEmail
}