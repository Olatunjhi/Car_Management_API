const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    totalCost: {
        type: Number,
        required: true,
        min: 0 // Total cost cannot be negative
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    tx_ref: {
        type: String,
        required: true,
        unique: true // Ensure each transaction reference is unique
    }
}, {
    timestamps: true,
    versionKey: false
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;