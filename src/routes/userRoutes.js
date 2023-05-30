// Include express module
const express = require("express");

// Icludes controller for further processing
const { register, login } = require("../controllers/userController");

// Includes express validators
const { isRequestValidated, validateRequestForRegister, validateRequestForLogin } = require("../validators/userAuth");

// Create router
const userRoutes = express.Router();

// For register
userRoutes.post("/register", validateRequestForRegister, isRequestValidated, register);

// For login
userRoutes.post("/login", validateRequestForLogin, isRequestValidated, login);


module.exports = userRoutes;