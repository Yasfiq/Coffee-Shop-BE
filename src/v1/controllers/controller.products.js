// Imports
const productsModel = require("../models/model.products"); // Products model
const cloudinary = require("../helpers/cloudinary");

// Controller
const productsController = {
  get: (req, res) => {
    // Page
    const page =
      req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    // Limit
    const limit =
      req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 10;
    // Offset
    const offset = limit * (page - 1);

    return (
      productsModel
        .get(req.query, limit, offset)
        .then((result) => {
          return res.send({
            Message: "Successfully fetch data from database",
            TotalRows: result.totalRows,
            TotalPage: result.totalPage,
            Data: result.Data,
          });
        })
        // Error handling
        .catch((error) => {
          return res.send({
            Message: `Failed to fetch, Error: ${error}`,
          });
        })
    );
  },
  getById: (req, res) => {
    // Id product
    const id = req.params.id;

    return productsModel
      .getById(id)
      .then((result) => {
        return res.send({
          Message: `Successfully fetch data id=${id} from database`,
          Data: result,
        });
      })
      .catch((error) => res.status(400).send({ Message: error }));
  },
  add: async (req, res) => {
    // Check if input is empty
    console.log("y");
    for (const value of Object.values(req.body)) {
      if (value == "") {
        return res.send({
          Message: "Product data must be filled in completely",
        });
      }
    }
    if (req.files.length == 0) {
      return res.send({
        Message: "Product data must be filled in completely",
      });
    }
    let result = [];
    await req.files.map((item, i) => {
      cloudinary.uploader
        .upload(item.path, {
          folder: "coffeeshop",
          format: "webp",
          public_id: `product-${new Date().getTime()}`,
        })
        .then((uploadResult) => {
          result.push(uploadResult);
          if (i == req.files.length - 1) {
            const request = {
              ...req.body,
              file: result,
            };
            return (
              productsModel
                .add(request)
                .then((result) => {
                  return res.send({
                    Message: result,
                  });
                })
                // Error handling
                .catch((error) => {
                  return res.status(400).send({
                    Message: `Failed to add, Error: ${error}`,
                  });
                })
            );
          }
        });
    });
  },
  edit: (req, res) => {
    const request = {
      id: req.params.id,
      ...req.body,
    };
    return (
      productsModel
        .edit(request)
        .then((result) => {
          return res.send({
            Message: `Successfully update data id=${result.id}`,
            Data: result,
          });
        })
        // Error handling
        .catch((error) => {
          return res.status(400).send({
            Status: 400,
            Message: `${error}`,
          });
        })
    );
  },
  remove: (req, res) => {
    // Id product
    const id = req.params.id;

    return (
      productsModel
        .remove(id)
        .then(async (result) => {
          for (let i = 0; i < result.productImage.length; i++) {
            await cloudinary.uploader.destroy(result.productImage[0].filename);
          }
          return res.send({
            Message: "Product data successfully deleted",
          });
        })
        // Error handling
        .catch((error) => {
          return res.send({
            Message: error,
          });
        })
    );
  },
};

// Exports
module.exports = productsController;
