const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: String,
    private_key: String
  },
  { timestamps: true }
);

module.exports.User = mongoose.model("user", UserSchema);
