const blacklistToken = require("../models/blacklistToken");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "token not found" });
    }

    const isBlacklisted = await blacklistToken.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ error: "token is blacklisted" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id)

        if(!user){
            throw new Error("User does not exist in middleware");
        }

        req.user = user;

        next();

    }catch(error){
        res.status(401).json({
            error: error.message
        });
    }
}