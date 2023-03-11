// Imports
const express = require("express"); // Express Js
const router = express(); // Express Js
const productsRoute = require("./route.products"); // Product Route
const authRoute = require("./route.auth"); // Auth route
const usersRoute = require("./route.users"); // User route
const ordersRoute = require("./route.orders"); // Orders route
const cartRoute = require("./route.cart"); // Cart Route

// Routing products
router.use("/products", productsRoute);
// Routing Auth
router.use("/auth", authRoute);
// Routing Users
router.use("/users", usersRoute);
// Routing Orders
router.use("/orders", ordersRoute);
// Routing Cart
router.use("/cart", cartRoute);

// Home route
router.get("/", (req, res) => {
  return res.status(200).send({
    Status: 200,
    Message: "Welcome to Homepage",
  });
});

// Exports
module.exports = router;
