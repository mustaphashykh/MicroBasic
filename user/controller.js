const userModel = require("./models/usermodel");
const expireTokenModel = require("./models/expireTokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const isUserExist = await userModel.findOne({ email });
    if (!isUserExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password
    );
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }
    const isTokenExist = await expireTokenModel.findOne({ token });
    if (isTokenExist) {
      return res.status(400).json({ message: "Token already expired" });
    }
    const newExpireToken = new expireTokenModel({ token });
    await newExpireToken.save();
    res.clearCookie("access_token", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userDetails = req.user;
    if (!userDetails) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({
      user: {
        id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
};
