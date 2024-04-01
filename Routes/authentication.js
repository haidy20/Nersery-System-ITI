const express = require("express");
const controller = require("./../Controller/authenticationController");

const router = express.Router();
router.route("/login")
.post(controller.login)

module.exports = router;
