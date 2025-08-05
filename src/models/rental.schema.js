const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    rentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carRented: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1 // Minimum duration of 1 day
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isRented: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
}, {
    timestamps: true,
    versionKey: false
});

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;