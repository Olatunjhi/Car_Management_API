const Car = require("../models/car.schema");
const Rental = require("../models/rental.schema");

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

        const rentalcar = await new Rental({
            rentedBy: userId,
            carRented: carId,
            duration,
            startDate,
            endDate,
            isRented: true,
            status: 'pending'
        });

        await rentalcar.save();

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

//exports.carRentCheckoutPayment = async (req, res) => {
  //  const userId = req.user.id;
    //const carId = req.params.carId;
