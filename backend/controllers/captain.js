const blacklistToken = require("../models/blacklistToken");
const Captain = require("../models/captain");
const {validationResult} = require("express-validator");

exports.registerCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    if (!fullname.firstname || !email || !password || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
      throw new Error("All fields are required");
    }

    const existingCaptain = await Captain.findOne({ email });

    if (existingCaptain) {
      throw new Error("Captain already exists. Please login");
    }

    const hashPassword = await Captain.hashPassword(password);

    const captain = await Captain.create({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashPassword,
        vehicle:{
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        }
    });

    const token = captain.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "Captain registered successfully",
      token,
      captain,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.loginCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new Error("All fields are required");
        }
    
        const captain = await Captain.findOne({ email }).select("+password");
    
        if (!captain) {
            throw new Error("Driver does not exist. Please register");
        }
    
        const isMatch = await captain.comparePassword(password);
    
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
    
        const token = captain.generateAuthToken();

        res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    
        res.status(200).json({
            success: true,
            message: "Captain logged in successfully",
            token,
            captain,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.getCaptainProfile = async (req, res) => {
    try{
        const captain = req.captain;

        res.status(200).json({
            success: true,
            captain
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}

exports.logoutCaptain = async (req, res) => {
    try{
        res.clearCookie("token");

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
          throw new Error("Unauthorized");
        }

        await blacklistToken.create({token});

        res.status(200).json({
            success: true,
            message: "Captain logged out successfully"
        });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}
