const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Database connection
const connectDB = require("./db/connect");
connectDB();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(cookieParser());

const userRouter = require("./router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(3001, () => {
  console.log("User service is running on port 3001");
});
