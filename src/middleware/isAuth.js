const { Jwt } = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const jwtScrect = process.env.JWT_SCRECT

const isAuthentication = async (req, res, next) => {
    const autHeader = req.headers.authorisation;

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

        const decoded = await Jwt.verify(token, jwtScrect);
        if (!decoded)
        {
            return res.status(401).json({message: 'Authentication failed to decoded'});
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authenticating error', error);
        return res.status(500).json({
            "error": {
                "code": "INTERNAL_SERVAL_ERROR",
                "message": "An unexcepted error occured. Please try again later."
            }
        })
    }
}

module.exports = isAuthentication;