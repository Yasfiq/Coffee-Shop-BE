/* eslint-disable no-unused-vars */
const multer = require("multer");
const path = require("path");

const formUploadOnline = multer({
  storage: multer.diskStorage({}), //test bisa atau ga
  fileFilter: (req, file, cb) => {
    //console.log(file);
    let formatType = path.extname(file.originalname);
    if (
      formatType == ".png" ||
      formatType == ".jpg" ||
      formatType == ".jpeg" ||
      formatType == ".webp"
    ) {
      cb(null, true);
    } else {
      cb("Format file is not supported!", false);
    }
  },
  limits: {
    fileSize: 1048576 * 5, //2 mb
  },
});

module.exports = formUploadOnline;
