const express = require("express");
const quotesController = require("../controller/quotes.controller");

const router = express.Router();

router.post("/getQuotes", quotesController.getQuotes);

module.exports = router;
