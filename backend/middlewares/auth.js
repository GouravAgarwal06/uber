const BlacklistToken = require("../models/blacklistToken");
const Captain = require("../models/captain");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id)

        if(!user){
            throw new Error("unauthorized");
        }

        req.user = user;

        next();

    }catch(error){
        res.status(401).json({
            error: error.message
        });
    }
}


exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await Captain.findById(decoded._id)

        if(!captain){
            throw new Error("unauthorized");
        }

        req.captain = captain;

        next();

    }catch(error){
        res.status(401).json({
            error: error.message
        });
    }
}