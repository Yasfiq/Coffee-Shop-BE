const usersModel = require('../models/model.users');


const usersController = {
    getById: (req, res) => {
        return usersModel.getById(req.params.id).then(result => {
            res.send(result)
        }).catch(err => {
            res.status(400).send({
                Message: `Failed to fetch, Error: ${err}`
            })
        })
    },
    edit: (req, res) => {
        const request = {
            ...req.body,
            id: req.params.id,
            file: req.file
        }
        return usersModel.edit(request).then(result => {
            res.send({
                Message: result
            })
        }).catch(err => {
            res.status(400).send({
                Message: `Failed update, ${err}`
            })
        })
    }
}


module.exports = usersController