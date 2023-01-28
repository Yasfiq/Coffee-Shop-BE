// Imports
const db = require('../helpers/database.connect') // Database connection
const { v4: uuidv4 } = require('uuid') // UUUID Generator Package

const productImageModel = {
    getById: (id) => {
        return new Promise((success, failed) => {
            db.query(`SELECT * FROM product_images WHERE id_product=$1`, [id], (error, result) => {
                if (error) return failed(error.message)
                return success(result.rows)
            })
        })        
    },
    add: ({id, file}) => {
        return new Promise((success, failed) => {
            db.query(`SELECT productname FROM products WHERE id='${id}'`, (error, result) => {
                if (error) return failed(error.message)
                if (result.rows.length == 0) return failed('Id not found!')
                db.query(`INSERT INTO product_images (id_image, id_product, name, filename) VALUES ($1, $2, $3, $4)`, [uuidv4(), id, result.rows[0].productname, file.filename], err => {
                    if (err) return failed(err.message)
                    return success(file.filename)
                })
            })
        })    
    },
    edit: ({id, file}) => {
        return new Promise((success, failed) => {
            db.query(`SELECT filename FROM product_images WHERE id_image='${id}'`, (error, result) => {
                if (error) return failed(error.message)
                if (result.rows == 0) return failed('Id not found!')
                db.query(`UPDATE product_images SET filename=$1 WHERE id_image=$2`, [file.filename, id], error => {
                    if (error) return failed(error.message) 
                    return success({oldImage: result.rows[0].filename, images: file.filename})
                })
            })
        })
    },
    remove: (id) => {
        return new Promise((success, failed) => {
            db.query(`DELETE FROM product_images WHERE id_image='${id}' RETURNING filename`, (err, result) => {
                if (err) return failed(err.message)
                if (result.rows.length == 0) return failed('Id not found!')
                return success(result.rows[0].filename)
            })
        })
    }
}


// Export
module.exports = productImageModel