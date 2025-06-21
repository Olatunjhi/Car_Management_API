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
    price: {
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
    }
},
{
    timestamps: true,
    versionKey: false
})

const Car = mongoose.model('Car', carSchema);

module.exports = Car;