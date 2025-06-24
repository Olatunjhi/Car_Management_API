const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const jwtSecret = process.env.JWT_SECRET

const isAuthentication = async (req, res, next) => {
    const autHeader = req.headers.authorization;

    try {
        if (!autHeader)
        {
            return res.status(401).json({message: 'Authentication failed!. Authorisation header is missing.'});
        }

        const token = autHeader.split(' ')[1];
        if (!token)
        {
            return res.status(401).json({message: 'Authentication failed!. Authentication token missing'});
        }

        const decoded = await jwt.verify(token, jwtSecret);
        if (!decoded)
        {
            return res.status(401).json({message: 'Authentication failed to decoded'});
        }

        req.user = decoded;
        console.log(req.user);
        next();
    } catch (error) {
        console.error('Authenticating error', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexcepted error occured. Please try again later."
            }
        })
    }
}

module.exports = isAuthentication;