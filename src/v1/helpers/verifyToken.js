// Imports
const jwt = require('jsonwebtoken')
require('dotenv').config()
// eslint-disable-next-line no-undef
const {SECRET_KEY} = process.env

const verifyToken = (req, res, next) => {
    if (!req.header('token')) {
        return res.status(400).send({
            Message: "you don't have access"
        })
    }
    else {
        jwt.verify(req.header('token'), SECRET_KEY, function(err, decoded) {
            if (!err) {
                if (decoded.role == 'user') {
                    return res.status(403).send({
                        Message: "You don't have access"
                    })
                } else {
                    next()
                }
            } else {
                return res.status(400).send({
                    Message: 'Token not valid!',
                    Error: err.message
                })
            }
        } )
    }
}

// Export
module.exports = verifyToken