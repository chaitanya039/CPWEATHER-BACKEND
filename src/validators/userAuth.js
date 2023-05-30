const { check, validationResult } = require('express-validator');

// check ([fields, errormsg]);
//  this function checks for all request objects not only for req.body
exports.validateRequestForRegister = [
    check('firstName', "First name is required").notEmpty(),
    check('lastName', "Last name is required").notEmpty(),
    check('email', "Valid email is required").isEmail(),
    check('password', "Password at least 6 characters long").isLength({ min: 6 }),
    check('contactNumber', "Please enter the valid phone number").isLength({ min: 10, max: 10 })
];

// validate request for login
exports.validateRequestForLogin = [
    check('email', "Valid email is required").notEmpty().isEmail(),
    check('password', "Password at least 6 characters long").isLength({ min: 6 })
];

// for checking login as well as register
exports.isRequestValidated = (req, res, next) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    // it there no errors means it is empty then it returns true else false
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
    return;
  };
