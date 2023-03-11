const usersModel = require("../models/model.users");
const cloudinary = require("../helpers/cloudinary");

const usersController = {
  getById: (req, res) => {
    return usersModel
      .getById(req.params.id)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({
          Message: `Failed to fetch, Error: ${err}`,
        });
      });
  },
  edit: async (req, res) => {
    const upload = req.file
      ? await cloudinary.uploader.upload(req.file.path, {
          folder: "coffeeshop",
          format: "webp",
          public_id: `profile-${new Date().getTime()}`,
        })
      : undefined;
    const request = {
      ...req.body,
      id: req.params.id,
      file: upload,
    };
    return usersModel
      .edit(request)
      .then(async (result) => {
        if (result.oldImage) {
          await cloudinary.uploader.destroy(result.oldImage);
          res.send({
            Message: "Success update profile!",
          });
        } else {
          res.send({
            Message: result,
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          Message: `Failed update, ${err}`,
        });
      });
  },
};

module.exports = usersController;
