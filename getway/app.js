const express = require("express");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use("/user", proxy(`${process.env.USER_SERVICE_URL}`));
app.use("/order", proxy(`${process.env.ORDER_SERVICE_URL}`));

app.listen(3000, () => {
  console.log("Gateway service is running on port 3000");
});
