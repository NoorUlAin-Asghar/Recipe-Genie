const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
        try {
            token = token.split(" ")[1]; // Remove 'Bearer '

            const {_id} = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById({_id}).select("_id"); // Don't send password
            next();
        } catch (err) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { verifyToken };