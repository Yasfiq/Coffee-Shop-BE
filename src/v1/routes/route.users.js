// Imports
const express = require("express"); // Express Js
const router = express(); // Express Js
// const verifyToken = require("../helpers/verifyToken"); // Token verifying
const upload = require("../helpers/upload.image");
const usersController = require("../controllers/controller.users");

// Endpoint Users
router.get("/:id", usersController.getById);
router.patch("/:id", upload.single("profile_image"), usersController.edit);

module.exports = router;
