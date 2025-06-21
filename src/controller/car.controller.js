const Car = require("../models/car.schema");
const User = require("../models/user.schema");

const addCar = async (req, res) => {
    const { id } = req.user.id;
    const { make, model, year, price, colour, brand } = req.body;

    try {
        if (!make || !model || !year || !price || !colour || !brand)
        {
            return res.status(400).json({message: 'All fields are required'});
        }

        const user = await User.findById(id);
        if (user.isAdmin !== true)
        {
            return res.status(401).json({message: 'Only admin can add car'});
        }

        const newCar = new Car({ make, model, year, price, colour, brand });
        await newCar.save();
        return res.status(201).json({message: 'New car added successfully'}, newCar);

    } catch (error) {
        console.error('error adding car', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

const editCar = async (req, res) => {
    const { id } = req.user.id;
    const { make, model, year, price, colour, brand } = req.body;
    
    const user = await User.findByIdAndUpdate(id);
}