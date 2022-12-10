const mongoose = require("mongoose");
const uuid = require("node-uuid");

const SystemSchema = new mongoose.Schema({
  systemName: String,
  systemID: {
    type: String,
    default: function genUUID() {
      uuid.v1();
    }
  }
});

module.exports.System = mongoose.model("system", SystemSchema);
