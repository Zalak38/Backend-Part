const uuid = require("node-uuid");

const { System } = require("../models/system");

const createSystem = async (req, res) => {
  const system = new System({
    systemName: req.body.systemName,
    systemID: uuid()
  });
  system
    .save()
    .then((system) => {
      console.log("res", system);
      res.send({ "system created": system });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { createSystem };
