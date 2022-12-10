const express = require("express");
const weatherController = require("../controller/weather.controller");

const router = express.Router();

router.post("/GetWeather", weatherController.GetWeather);

module.exports = router
