const express = require("express");
const systemController = require("../controller/system.controller");

const router = express.Router();

router.post("/createSystem", systemController.createSystem);

module.exports = router;
