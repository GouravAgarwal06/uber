const blacklistToken = require("../models/blacklistToken");
const User  = require("../models/user");
const {validationResult} = require("express-validator");

exports.registerUser = async (req, res) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {fullname,email, password} = req.body;

        if (!fullname.firstname || !email || !password) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            throw new Error("User already exists. Please login");
        }

        const hashPassword = await User.hashPassword(password);

        const user = await User.create({
            email, 
            password:hashPassword, 
            fullname:{
                firstname:fullname.firstname,
                lastname:fullname.lastname
            }
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.loginUser = async (req, res) => {
    try{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        if(!email || !password){
            throw new Error("All fields are required");
        }   

        const user = await User.findOne({email}).select("+password");

        if(!user){
            throw new Error("User does not exist. Please register");
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            throw new Error("Invalid credentials");
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {maxAge: 30 * 24 * 60 * 60 * 1000});

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}

exports.getUserProfile = async (req, res) => {
    try{
        const user = req.user;

        res.status(200).json({
            success: true,
            user
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}

exports.logoutUser = async (req, res) => {
    try{
        res.clearCookie("token");

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("Unauthorized");
        }

        await blacklistToken.create({token});

        res.status(200).json({
            message: "User logged out successfully"
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}