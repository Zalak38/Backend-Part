const express = require("express");
const eventController = require("../controller/event.controller");

const router = express.Router();

router.get("/", eventController.getAllEvent);
router.post("/createEvent", eventController.createEvent);
router.patch("/updateEvent/:id", eventController.updateEvent);
router.delete("/deleteEvent/:id", eventController.deleteEvent);
router.get("/getDailyEvent/:id", eventController.getDailyEvent);
router.get("/getEvent/:id", eventController.getEventById);
router.get("/getGoogleEvent", eventController.getGoogleEvent);
router.get("/getString", eventController.getString);

module.exports = router;
