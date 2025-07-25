const Car = require("../models/car.schema");
const User = require("../models/user.schema");
const pagination = require("../utils/car.pignation");

const addCar = async (req, res) => {
    const { make, model, year, price, colour, brand, description } = req.body;
    const id = req.user.id;

    try {
        if (!make || !model || !year || !price || !colour || !brand || !description)
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
    const id = req.user.id;
    const { carId } = req.params;
    const { make, model, year, price, colour, brand, description } = req.body;
    
    try {
        const user = await User.findById(id);
        if (user.isAdmin != true)
        {
            return res.status(401).json({message: 'Only admin can edit'});
        }

        const car = await Car.findById(carId);
        if (!car)
        {
            return res.status(404).json({message: 'Car could not be found'});
        }

        car.make = make || car.make;
        car.model = model || car.model;
        car.year = year || car.year;
        car.price = price || car.price;
        car.colour = colour || car.colour;
        car.brand = brand || car.brand;
        car.description = description || car.description;

        await car.save();
        return res.status(200).json({message: 'Car edited successfully'});

    } catch (error) {
        console.error('error editing car', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

const getAllCars = async (req, res) => {
    const { page, limit, skip } = pagination(req.query);
    try {
        const cars = await Car.find().select('make model year price colour brand').skip(skip).limit(limit);
        return res.status(200).json({page, message: 'All available cars :', cars});

    } catch (error) {
        console.error('error getting all cars', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

const searchCar = async (req, res) => {
    const { make } = req.query;

    try {
        const car = await Car.find({ make });
        return res.status(200).json({message: 'searched for the successfully', car});
    } catch (error) {
        console.error('error searching for car', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

const deleteCar = async (req, res) => {
    const id = req.user.id;
    const { carId } = req.params;

    try {
        const user = await User.findById(id);
        if (user.isAdmin !== true)
        {
            return res.status(401).json({message: 'Only admin can delete car'});
        }

        const car = await Car.findByIdAndDelete(carId);
        if (!car)
        {
            return res.status(404).josn({message: 'Car does not exist'});
        }
        return res.status(200).json({message: 'Car deleted successfully'});

    } catch (error) {
        console.error('error deleting car', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occured. Please try again later."
            }
        })
    }
}

module.exports = {
    addCar, editCar, getAllCars, searchCar, deleteCar
}