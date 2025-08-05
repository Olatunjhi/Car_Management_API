const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        require: true,
        trim: true
    },
    model: {
        type: String,
        require: true,
        trim: true
    },
    year: {
        type: Number,
        require: true
    },
    buyPrice: {
        type: Number,
        require: true
    },
    colour: {
        type: String,
        require: true,
        trim: true
    },
    brand: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require:true,
        trim: true
    },
    startDate: {
        type: Date,
        trim: true,
        require: true
    },
    endDate: {
        type: Date,
        trim: true,
        require: true
    },
    rentPrice: {
        type: Number
    },
    rentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isRented: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
    versionKey: false
})

const Car = mongoose.model('Car', carSchema);

module.exports = Car;