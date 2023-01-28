// Imports
const db = require('./database.connect') // Database Connection


const checkDuplicate = (username) => {
    return new Promise((success, failed) => {
        db.query(`SELECT * FROM users WHERE username='${username}'`, (error, result) => {
            if (error) {
                return failed(error.message)
            } else if (result.rows.length != 0) {
                return success(result.rows)
            } else {
                return success()
            }
        }) 
    })
}

// Export
module.exports = checkDuplicate