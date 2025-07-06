const Car = require("../models/car.schema");

exports.rentCar = async (req, res) => {
    const carId = req.params;
    const userId = req.user.id;
    const { startdate, enddate, rentprice } = req.body;

    if (!startdate || !enddate || !rentprice)
    {
        return res.status(400).json({message: "All feilds are required"});
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

        car.startDate = startdate;
        car.endDate = enddate;
        car.rentPrice = rentprice;
        car.rentedBy = userId;
        car.status = 'pending...';
        car.save();

        return res.status(200).json({message: "Your request is on process", car});

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