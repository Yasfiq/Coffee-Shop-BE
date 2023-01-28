// Imports
const productsModel = require('../models/model.products') // Products model
const validator = require('validator') // validator
const { unlink } = require('node:fs')


// Controller
const productsController = {
    get: (req, res) => {
        // Page
        const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) : 1
        // Limit
        const limit = (req.query.limit && req.query.limit > 0) ? parseInt(req.query.limit) : 10
        // Offset
        const offset = limit * (page - 1)

        return productsModel.get(req.query, limit, offset).then(result => {
            return res.send({
                Message: 'Successfully fetch data from database',
                TotalRows: result.totalRows,
                TotalPage: result.totalPage,
                Data: result.Data
            })
        })
        // Error handling
        .catch(error => {
            return res.send({
                Message: `Failed to fetch, Error: ${error}`
            })
        })
    },
    getById: (req, res) => {
        // Id product
        const id = req.params.id

        return productsModel.getById(id).then(result => {
            return res.send({
                Message: `Successfully fetch data id=${id} from database`,
                Data: result
            })
        }).catch(error => res.status(400).send({ Message: error }))
    },
    add: (req, res) => {
        // Check if input is empty
        for (const value of Object.values(req.body)) {
            if (value == "") {
                return res.send({
                    Message: "Product data must be filled in completely"
                })
            }
        }
        console.log(req.body.productname);
        // Remove space character
        let productname = req.body.productname.replace(/[\s]/g, '')
        // let category = req.body.category.replace(/[\s]/g, '')
        // // Validation product & category must be letters or number
        // if (!validator.isAlphanumeric(productname) || !validator.isAlphanumeric(category)) {
        //     return res.send({
        //         Message: 'Product name and category can only consist of letters and numbers!'
        //     })
        // }
        // // Validation price must be number 
        // else if (!validator.isNumeric(req.body.price)) {
        //     return res.send({
        //         Message: 'Price must consist of numbers!'
        //     })
        // } 
        // All validations have been fulfilled
        // else {
            const request = {
                ...req.body,
                file: req.files
            }
            return productsModel.add(request).then(result => {
                return res.send({
                    Message: result
                })
            })
            // Error handling
            .catch(error => {
                return res.status(400).send({
                    Message: `Failed to add, Error: ${error}`
                })
            })
        //}
    },
    edit: (req, res) => {
        const request = {
            file: req.files,
            id : req.params.id,
            ...req.body
        }

        return productsModel.edit(request).then(result => {
            if (typeof result.oldImages != 'undefined') {
                for (let i = 0;i < result.oldImages.length;i++) {
                    unlink(`public/uploads/${result.oldImages[i].filename}`, (err) => {
                        if (err) throw err;
                        console.log(`${result.oldImages[i].filename} was deleted`);
                    });
                }
            }
            return res.send({
                Message: `Successfully update data id=${result.id}`,
                Data: result
            })
        })
        // Error handling
        .catch(error => {
            return res.status(400).send({
                Status: 400,
                Message: `${error}`
            })
        })
    },
    // SINGLE
    // edit: (req, res) => {
    //     // Id product
    //     const id = req.params.id

    //     return productsModel.edit(req, id).then(result => {
    //         return res.send({
    //             Message: result,
    //         })
    //     })
    //     // Error handling
    //     .catch(error => {
    //         return res.status(400).send({
    //             Status: 400,
    //             Message: `${error}`
    //         })
    //     })
    // },
    remove: (req, res) => {
        // Id product
        const id = req.params.id

        return productsModel.remove(id).then(result => {
            for (let i = 0;i < result.productImage.length;i++) {
                unlink(`public/uploads/${result.productImage[i].filename}`, (err) => {
                    if (err) throw err;
                    // console.log(`${result.productImage[i].filename} was deleted`);
                });
            }
            return res.send({
                Message: 'Product data successfully deleted'
            })
        })
        // Error handling
        .catch(error => {
            return res.send({
                Message: error
            })
        })
    }
}

// Exports
module.exports = productsController