const express = require("express");
const router = express.Router();
const userController = require("./controller");
const { register, login, logout, getProfile } = userController;
const { authMiddleware } = require("./middleWare");

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
