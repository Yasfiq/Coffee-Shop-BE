// Imports
const db = require('../helpers/database.connect')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

// Model
const authModel = {
    login: ({username, password}) => {
        return new Promise((success, failed) => {
            db.query(`SELECT * FROM users WHERE username=$1`,
                [username],
                (error, result) => {
                    if (error) return failed(error.message)
                    if (result.rows[0] == undefined ) {
                        return failed('Username or Password is wrong!')
                    }
                    bcrypt.compare(password, result.rows[0].password, function(err, res) {
                        if (err) return failed('Kesalahan server!')
                        if (!res) return failed('Username or Password is wrong!')
                        return success(result.rows[0])
                    })
                }
            )
        })
    },
    register: ({name, username, email}, password) => {
        return new Promise((success, failed) => {
            db.query(`INSERT INTO users (id, name, username, password, email) VALUES  ($1, $2, $3, $4, $5)`,
                [uuidv4(), name, username, password, email],
                (error, result) => {
                    if (error) {
                        return failed(error.message)
                    } else {
                        return success(result.rows)
                    }
                }
            )
        })
    }
}

// Export
module.exports = authModel