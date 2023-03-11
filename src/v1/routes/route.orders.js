// Imports
const express = require("express"); // Express Js
const router = express(); // Express Js
const ordersController = require("../controllers/controller.orders"); // Products Controller
// const verifyToken = require("../helpers/verifyToken"); // Token verifying

// Endpoint Orders
router.get("/:id", ordersController.getById);
router.post("/:id", ordersController.add);
router.patch("/:id", ordersController.edit);

// Exports
module.exports = router;
