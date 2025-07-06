const express = require("express");
const isAuthentication = require("../middleware/isAuth");
const { addCar, editCar, getAllCars, searchCar, deleteCar } = require("../controller/admin.controller");
const { rentCar } = require("../controller/rental.controller");
const router = express.Router();

router.get('/get-all-cars',getAllCars);
router.get('/search', searchCar);
router.post('/add', isAuthentication, addCar);
router.patch('/edit/:carId', isAuthentication, editCar);
router.delete('/delete/:carId', isAuthentication, deleteCar);

router.post('/rent/:carId', rentCar);

module.exports = router;