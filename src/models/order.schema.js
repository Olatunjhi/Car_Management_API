const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1 // Minimum duration of 1 day
    },
    tx_ref: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
},
{
    timestamps: true,
    versionKey: false
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;