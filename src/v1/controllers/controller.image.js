// Imports
const productImageModel = require('../models/model.image')
const { unlink } = require('node:fs')


// Controller
const productImageController = {
    getById: (req, res) => {
        return productImageModel.getById(req.params.id).then(result => {
            return res.send({
                Message: 'Success',
                Data: result
            })
        }).catch(error => req.send({ Message: error }))
    },
    add: (req, res) => {
        const request = {
            id: req.params.id,
            file: req.file
        }
        return productImageModel.add(request).then(result => {
            return res.send({
                Message: 'Data successfully added to database',
                Data: result
            })
        }).catch(error => req.send({ Message: error }))
    },
    edit: (req, res) => {
        const request = {
            id: req.params.id,
            file: req.file
        }
        return productImageModel.edit(request).then(result => {
            unlink(`public/uploads/${result.oldImage}`, (err) => {
                if (err) throw err;
                console.log(`${result.oldImage} was deleted`);
            });
            return res.send({
                Message: 'Successfully update images',
                Data: result
            })
        }).catch(error => res.send({ Message: error }))
    },
    remove: (req, res) => {
        return productImageModel.remove(req.params.id).then(result => {
            unlink(`public/uploads/${result}`, (err) => {
                if (err) throw err;
                console.log(`${result} was deleted`);
            });
            return res.send({
                Message: 'Product image successfully deleted'
            })
        }).catch(error => {
            return res.send({ Message: error })
        })
    }
}


// Exports
module.exports = productImageController