const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
    try {
        const token = req.header("Auhtorization").replace("Bearer", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        if (!user) {
            throw newError("User not logged in");
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send("User not logged in");
    }
};
const admin = (req, res, next) => { };
module.exports = auth;