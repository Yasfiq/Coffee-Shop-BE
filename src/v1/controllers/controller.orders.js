// Imports
const ordersModel = require("../models/model.orders");

const ordersController = {
  getById: (req, res) => {
    return ordersModel
      .getById(req.params.id)
      .then((result) => {
        res.send({
          Message: "Success",
          Data: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          Message: err,
        });
      });
  },
  add: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return ordersModel
      .add(request)
      .then((result) => {
        res.send({
          Message: "Success",
          Data: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          Message: err,
        });
      });
  },
  edit: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };

    return ordersModel
      .edit(request)
      .then((result) => {
        res.send({
          Message: `Successfully update order payment!`,
          Data: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          Message: err,
        });
      });
  },
};

module.exports = ordersController;
