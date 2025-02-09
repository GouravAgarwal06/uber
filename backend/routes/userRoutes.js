const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const { registerUser } = require("../controllers/user");

router.post('/register',[
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname").isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
],registerUser)



module.exports = router;