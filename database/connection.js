const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb+srv://root:root123@calanderdemo.nljblxj.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("database connected "))
  .catch((e) => {
    console.log(e);
  });

module.exports = db;
