const mongoose = require("mongoose");
const Order = require("../models/order.schema");
const dotenv = require('dotenv');
dotenv.config();
 
exports.flutterwaveWebhook = async (req, res) => {
    console.log('flutterwave webhook called');
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
        const signature = req.headers['verif-hash'];

        if ( !signature || signature !== secretHash) {
            console.error('Invalid signature');
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Unathurized: Invalid signature' });
        }

        const { event, data } = req.body;

        if (!event)
        {
            console.error('Event not provided');
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Bad Request: Event not provided' });
        }

        if (event === 'charge.completed') {
            const { tx_ref, status, amount } = data;

            if (status !== 'successful') {
                console.error('Payment not successful');
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Bad Request: Payment not successful' });
            }

            const order = await Order.findOneAndUpdate(
                { status: 'pending', tx_ref, totalCost: amount },
                { status: 'completed'},
                { new: true, session }
            );

            if (!order) {
                console.error('Order not found or already completed or not match exact amount to the order');
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Not Found: Order not found or already completed' });
            }

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ message: 'Payment processed successfully', order });
        } else {
            console.warn(`Unhandled event type: ${event}`);
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({ message: `Event ${event} received but not handled` });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Internal Server Error: An error occurred while processing the webhook' });
    }
}