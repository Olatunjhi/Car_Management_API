const user = require("../models/user.schema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
//const jwt = require("jsonwebtoken");

dotenv.config();
const saltRound = process.env.SALT_ROUND;
//const jwtScrect = process.env.JWT_SCRECT;
//const jwtExpiration = process.env.JWT_EXPIRATION;

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password)
        {
           return res.status(400).json({message: 'All field are required'});
        }

        const existingUser = await user.findOne({ email });

        if (existingUser)
        {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = new user({ name, email, password: hashedPassword });
        
        await newUser.save();
        return res.status(201).json({message: 'Sign up successful', newUser});
    } catch (error) {
        console.error('error signing up', error);
        return res.status(500).json({
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Unexpected error occured. Please try again later"
        })
    }
}

const login = async (req,res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
        {
            return res.status(400).json({message: 'All fields are require'});
        }

        const userExists = await user.findOne({ email });

        if (!userExists)
        {
            return res.status(404).json({message: 'User does not exist'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

        if (!isPasswordCorrect)
        {
            return res.status(401).json({message: 'Incorrect password'});
        }

        return res.status(200).json({message: 'User login successfully', userExists});

    } catch (error) {
        console.error('error login', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected error occured. Please try agian later"
            }
        })
    }
}

module.exports = {
    signup, login
}