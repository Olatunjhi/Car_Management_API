const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    password: {
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

const user = mongoose.model('user', userSchema);

module.exports = user;