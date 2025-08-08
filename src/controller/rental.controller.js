const Car = require("../models/car.schema");
const Order = require("../models/order.schema");
const axios = require("axios");

exports.rentCar = async (req, res) => {
    const carId = req.params.carId;
    const userId = req.user.id;
    const { duration } = req.body;

    if (!userId)
    {
        return res.status(401).json({message: "Unauthorized user. Please login to continue"});
    }

    if (!duration)
    {
        return res.status(400).json({message: "Duration is required in days"});
    }
    
    try {
        const car = await Car.findById(carId);
        if (!car)
        {
            return res.status(404).json({message: "Car not found"});
        }

        if (car.isRented)
        {
            return res.status(400).json({message: "Car is already rented. check another one"});
        }

        const amount = car.rentPrice * duration;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);

        const existingInitiatedCarOrder = await Order.findOneAndUpdate(
            { rentedBy: userId, status: 'pending', carRented: carId },
            { startDate, endDate, duration, totalCost: amount },
            { new: true }
        );
        if (existingInitiatedCarOrder)
        {
            return res.status(201).json({
                message: "You have already initiated a car rental order",
                rentPrice: amount,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
        }

        const initiateCarOrder = await new Order({
            rentedBy: userId,
            carRented: carId,
            duration,
            startDate,
            endDate,
            totalCost: amount,
            status: 'pending'
        });

        await initiateCarOrder.save();

        return res.status(201).json({
            message: "Details of what to know before renting",
            rentPrice: amount,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });

    } catch (error) {
        console.error("error renting car", error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later"
            }
        })
    }
}

exports.carRentCheckoutPayment = async (req, res) => {
    const userId = req.user.id;
    
    const initiatedOrder = await Order.findOne({ rentedBy: userId, status: 'pending' }).populate('carRented');
    if (!initiatedOrder)
    {
        return res.status(404).json({message: "No pending order found for this user"});
    }

    try {
        const tx_ref = `tx_${Date.now()}_${userId}`;
        initiatedOrder.tx_ref = tx_ref;
        await initiatedOrder.save();

        const paymentPayload = {
            tx_ref,
            amount: initiatedOrder.totalCost,
            currency: 'NGN',
            redirect_url: `${process.env.BASE_URL}/api/v1/rental/payment-result`,
            customer: {
                email: req.user.email,
                name: req.user.name,
                id: userId
            },
            customizations: {
                title: 'Car Rental Payment',
                description: `Payment for rental of car ${initiatedOrder.carRented.name}`,
            }
        };

        const flutterwaveRes = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            paymentPayload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const paymentUrl = flutterwaveRes.data?.data?.link;

        if (!paymentUrl)
        {
            return res.status(500).json({
                "error": {
                    "code": "PAYMENT_URL_NOT_FOUND",
                    "message": "Payment URL could not be generated. Please try again later"
                }
            });
        }

        return res.status(200).json({
            message: "Payment initiated successfully",
            paymentUrl: paymentUrl,
        });
    } catch (error) {
        console.error("Error initiating payment", error);
        return res.status(500).json({
            "error": {
                "code": "PAYMENT_INITIATION_ERROR",
                "message": "An error occurred while initiating payment. Please try again later"
            }
        });
    }
}
