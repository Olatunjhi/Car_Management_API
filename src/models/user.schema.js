const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: function() {
            return !this.googleId; // Password is required only if googleId is not set
        },
        minlength: 6
    },
    avatar: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true
    },
    provider: {
        type: String,
        enum: ['google', 'local'],
        default: 'local'
    },
    userProfilePics: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        },
        updatedAt: {
            type: Date,
            default: null
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
        default: null  
    },
    emailToken: {
        type: String,
        default: null
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
},
{
    versionKey: false,
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;