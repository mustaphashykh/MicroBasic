const mongoose = require("mongoose");

const expireTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const expireTokenModel = mongoose.model("ExpireToken", expireTokenSchema);
module.exports = expireTokenModel;
