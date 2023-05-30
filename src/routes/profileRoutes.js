const express = require("express");
const auth = require("../utils/auth");
const { updateName, updatePassword, updateProfilePicture } = require("../controllers/profileControllers");
const profileRoutes = express.Router();

profileRoutes.post("/updateName", auth, updateName);
profileRoutes.post("/updatePassword", auth, updatePassword);
profileRoutes.post("/updateProfilePicture", auth, updateProfilePicture);

module.exports = profileRoutes;