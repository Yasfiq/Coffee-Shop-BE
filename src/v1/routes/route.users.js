// Imports
const express = require('express') // Express Js
const router = express() // Express Js
const verifyToken = require('../helpers/verifyToken') // Token verifying
const {upload, uploadSingle } = require('../helpers/upload.image') // Upload Image
const usersController = require('../controllers/controller.users')


// Endpoint Users
router.get('/:id', usersController.getById)
router.patch('/:id', uploadSingle.single('profile_image'), usersController.edit)


module.exports = router