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
            throw new Error("User already exists");
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
            throw new Error("User does not exist");
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            throw new Error("Invalid credentials");
        }

        const token = user.generateAuthToken();

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}