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
        require: true,
        trim: true,
        minlength: 6
    },
    newPassword: {
        type: String,
        require: true,
        trim: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false,
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;