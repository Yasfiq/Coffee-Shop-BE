// Imports
const express = require("express"); // Express Js
const router = express(); // Express Js
const productsController = require("../controllers/controller.products"); // Products Controller
const productImageController = require("../controllers/controller.image");
const verifyToken = require("../helpers/verifyToken"); // Token verifying
const upload = require("../helpers/upload.image");

// Endpoint Product
router.get("/", productsController.get);
router.get("/:id", productsController.getById);
router.post(
  "/",
  verifyToken,
  upload.array("productimage"),
  productsController.add
);
router.patch(
  "/:id",
  /*verifyToken,*/ upload.array("productimage"),
  productsController.edit
);
router.delete("/:id", /*verifyToken,*/ productsController.remove);

// Endpoint Images
router.get("/image/:id", productImageController.getById);
router.post(
  "/image/:id",
  upload.single("productimage"),
  productImageController.add
);
router.patch(
  "/image/:id",
  upload.single("productimage"),
  productImageController.edit
);
router.delete("/image/:id", productImageController.remove);

// Exports
module.exports = router;
