const jwt = require("jsonwebtoken");
const userModel = require("./models/usermodel");
const expireTokenModel = require("./models/expireTokenModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isExpired = await expireTokenModel.findOne({ token });
    if (isExpired) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  authMiddleware,
};
