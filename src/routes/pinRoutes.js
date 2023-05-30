const express = require("express");
const pinRoutes = express.Router();
const auth = require("../utils/auth");
const { createPin, getPins } = require("../controllers/pinController");

pinRoutes.post("/pins", auth, createPin);
pinRoutes.get("/pins", auth, getPins);

module.exports = pinRoutes;