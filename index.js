const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./src/conf/db");
const userRouter = require("./src/route/user.route");
const carRouter = require("./src/route/car.route");


dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/user', userRouter);
app.use('/api/car', carRouter);


app.listen(port, () => {
    connectDb();
    console.log(`server listen on port ${port}...`);
})