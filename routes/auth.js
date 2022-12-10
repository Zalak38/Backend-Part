const express = require("express");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
const authController = require("../controller/auth.controller");
const { route } = require("./weather");

const router = express.Router();

router.post("/createAuthLink", authController.createAuthLink);
router.get("/handleGoogleRedirect", authController.googleRedirect);
router.post("/getValidToken", authController.getValidToken);

module.exports = router;
