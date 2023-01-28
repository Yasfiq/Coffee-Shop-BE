// Imports
const db = require('../helpers/database.connect') // Database Connection
const { v4: uuidv4 } = require('uuid') // UUUID ID Generator Package

// Model
const productsModel = {
    get: function (queryParams, limit, offset) {
        return new Promise((success, failed) => {
            db.query(`SELECT p.id, p.productname, p.price, p.category, json_agg(row_to_json(i)) productimage FROM products AS p INNER JOIN product_images AS i ON p.id=i.id_product ${this.search(queryParams.search)} ${this.category(queryParams.category)} GROUP BY p.id ${this.sort(queryParams.sort)} ${this.order(queryParams.order)} ${this.pagination(limit, offset)}`, async (error, result) => {
                if (error) {
                    return failed(error.message)
                } else {
                    const totalRows = await this.total()
                    const totalPage = Math.ceil(totalRows / limit)
                    return success({
                        Data: result.rows,
                        totalRows,
                        totalPage
                    })
                }
            })
        })
    },
    getById: (id) => {
        return new Promise((success, failed) => {
            db.query(`SELECT p.id, p.productname, p.price, p.category, p.description, p.size, p.delivery, json_agg(row_to_json(i)) productimage FROM products AS p INNER JOIN product_images AS i ON p.id=i.id_product AND p.id='${id}' GROUP BY p.id`, (error, result) => {
                if (error) {
                    return failed(error.message)
                } else {
                    if (result.rows.length == 0) return failed('Id not found!')
                    return success(result.rows)
                }
            })
        })
    },
    add: function({ productname, price, description, category, size, delivery, file }) {
        return new Promise((success, failed) => {
            db.query(`INSERT INTO products (id, productname, price, description, category, size, delivery) VALUES ('${uuidv4()}','${productname}',${price},'${description}','${category}','${this.toArrayQuery(size)}','${this.toArrayQuery(delivery)}') RETURNING id`, (error, result) => {
                if (error) {
                    return failed(error.message)
                } else {
                    for (let i = 0;i < file.length;i++) {
                        db.query(`INSERT INTO product_images (id_image, id_product, name, filename) VALUES ($1, $2, $3, $4)`,
                        [`${uuidv4()}`, result.rows[0].id, productname, file[i].filename], (err) =>{
                            if (err) {
                                return failed(err.message)
                            } else {
                                return success('Data successfully added to database')
                            }     
                        } )
                    }
                }
            })
        })
    },
    edit: function({ id, productname, price, category, description, size, delivery, file }) {
        return new Promise((success, failed) => {
            db.query(`SELECT * FROM products WHERE id='${id}'`, (error, dataRes) => {
                if (error) {
                    return failed(error.message)
                } else {
                    if (dataRes.rows.length == 0) {
                        return failed('Id not found!')
                    } else {
                        db.query(`UPDATE products SET productname='${productname || dataRes.rows[0].productname}', price=${price || dataRes.rows[0].price},  category='${category || dataRes.rows[0].category}',  description='${description || dataRes.rows[0].description}', size='${this.toArrayQuery(size) || this.toArrayQuery(dataRes.rows[0].size)}', delivery='${this.toArrayQuery(delivery) || this.toArrayQuery(dataRes.rows[0].delivery)}' WHERE id='${id}'`, (error) => {
                            if (error) {
                                return failed(error.message)
                            } else {
                                if (file.length == 0) {
                                    db.query(`UPDATE product_images SET name=$1 WHERE id_product=$2`, [productname || dataRes.rows[0].productname, id], (err) => {
                                        if(err) {
                                            return failed(err.message)
                                        }
                                    })
                                    return success({ id, productname, price, category, description, size, delivery })
                                }
                                db.query(`SELECT id_image,filename FROM product_images WHERE id_product='${id}'`, (errOld, resultOld) => {
                                    if (errOld) return failed(error.message)
                                    for (let i = 0;i < file.length; i++) {
                                        if (i >= resultOld.rows.length) {
                                            // console.log(`file ${i}`);
                                            db.query(`INSERT INTO product_images (id_image, id_product, name, filename) VALUES ($1, $2, $3, $4)`, [uuidv4(), id, productname || dataRes.rows[0].productname, file[i].filename], (err) => {
                                                if (err) return failed(err.message)
                                            })
                                        } else {
                                            // console.log(`file ${i}`);
                                            db.query(`UPDATE product_images SET name=$1, filename=$2 WHERE id_image=$3`, [productname || dataRes.rows[0].productname, file[i].filename, resultOld.rows[i].id_image], (err) => {
                                                if (err) return failed(err.message)
                                                return success({ id, productname, price, category, description, size, delivery, oldImages: resultOld.rows, productimage: file })
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        })
    },
    // SINGLE
    // edit: function(req, id) {
    //     return new Promise((success, failed) => {
    //         const { productname, price, category, description, size, delivery } = req.body
    //         db.query(`SELECT * FROM products WHERE id='${id}'`, (error, dataRes) => {
    //             if (error) {
    //                 return failed(error.message)
    //             } else {
    //                 if (dataRes.rows.length < 1) {
    //                     return failed('Id not found!')
    //                 } else {
    //                     db.query(`UPDATE products SET productname='${productname || dataRes.rows[0].productname}', price=${price || dataRes.rows[0].price},  category='${category || dataRes.rows[0].category}',  description='${description || dataRes.rows[0].description}', size='${this.toArrayQuery(size) || this.toArrayQuery(dataRes.rows[0].size)}', delivery='${this.toArrayQuery(delivery) || this.toArrayQuery(dataRes.rows[0].delivery)}', productimage='${(req.file != undefined) ? req.file.filename : dataRes.rows[0].productimage}' WHERE id='${id}'`, (error) => {
    //                         if (error) {
    //                             return failed(error.message)
    //                         } else {
    //                             return success(`Successfully update data id=${id}`)
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     })
    // },
    remove: (id) => {
        return new Promise((success, failed) => {
            db.query(`DELETE FROM products WHERE id='${id}'`, (error) => {
                if (error) {
                    return failed(error.message)
                } else {
                    db.query(`DELETE FROM product_images WHERE id_product=$1 RETURNING filename`, [id], (error, result) => {
                        if (error) return failed('Failed to delete image!')
                        if (result.rows.length == 0) return failed('Id not found!')
                        return success({ productImage: result.rows })
                    })
                }
            })
        })
    },
    search: (queryParams) => {
        if (queryParams) {
            return `AND p.productname ILIKE '%${queryParams}%'`
        } else {
            return ''
        }
    },
    sort: (queryParams) => {
        if (queryParams) {
            return `ORDER BY ${queryParams}`
        } else {
            return `ORDER BY productname`
        }
    },
    order: (queryParams) => {
        if (queryParams === 'DESC' || queryParams === 'desc') {
            return 'DESC'
        } else {
            return ''
        }
    },
    pagination: (limit, offset) => {
        if (offset > 0 || limit == 1) {
            return `LIMIT ${limit} OFFSET ${offset}`
        } else {
            return `LIMIT ${limit}`
        }
    },
    total: () => {
        return new Promise((success, failed) => {
            db.query(`SELECT COUNT(id) FROM products`, (error, dataRes) => {
                if (error) {
                    return failed(error.message)
                } else {
                    return success(dataRes.rows[0].count)
                }
            })
        }).then(res => parseInt(res))
    },
    toArrayQuery: (array) => {
        if (array != undefined) {
            let newArray = [];
            for (let i = 0; i < array.length; i++) {
            newArray.push(`"${array[i]}"`);
            }
            const result = `{ ${(newArray.length == 1) ? newArray : newArray.join(',')} }`;
            return result
        } else {
            return
        }
    },
    category: (queryParams) => {
        if (queryParams) {
            return `AND p.category='${queryParams}'`
        } else {
            return ''
        }
    } 
}

// Exports
module.exports = productsModel