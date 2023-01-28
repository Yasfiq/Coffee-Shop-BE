// Imports
const authModel = require('../models/model.auth.js')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
// eslint-disable-next-line no-undef
const {SECRET_KEY} = process.env
const jwt = require('jsonwebtoken')

// Controller
const authController = {
    login: (req, res) => {
        return authModel.login(req.body).then(result => {
            jwt.sign({ id: result.id, role: result.role }, SECRET_KEY, {expiresIn: '1d'}, (err, token) => {
                return res.send({
                    Message: 'Successfully login!',
                    data: {
                        token,
                        id: result.id,
                        name: result.name,
                        image: result.profile_image,
                        role: result.role,
                    }
                })
            })
        }).catch(error => {
            return res.status(400).send({
                Message: error
            })
        })
    },
    register: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json( errors.array() )
        }
        // If name empty
        if (req.body.name === '') {
            res.status(400).send({
                Message: 'Name must be filled!'
            })
        }
        // If username or password empty
        else if (req.body.username === '' || req.body.password === '') {
            res.status(400).send({
                Message: 'Username and Password cannot be empty!'
            })
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            return authModel.register(req.body, hash).then(() => {
                res.send({
                    Message: 'Successfully register!'
                })
            }).catch(error => {
                res.status(400).send({
                    Message: `Failed to register : ${error}`
                })
            })
        })
    }
}

// Export
module.exports = authController