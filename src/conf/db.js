const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = process.env.DB_CONNECT;

const connectDb = async () => {
    try {
        await mongoose.connect(dbConnect);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('error connecting database', error);
        return exit(1);
    }
}

module.exports = connectDb;