// Imports
const db = require("../helpers/database.connect"); // Database Connection

const usersModel = {
  getById: (id) => {
    return new Promise((success, failed) => {
      db.query(
        `SELECT name,username,email,firstname,lastname,birth_date,mobile_number,address,profile_image FROM users WHERE id='${id}'`,
        (error, result) => {
          if (error) {
            return failed(error.message);
          } else {
            return success(result.rows);
          }
        }
      );
    });
  },
  edit: ({
    id,
    name,
    username,
    email,
    firstname,
    lastname,
    birth_date,
    mobile_number,
    address,
    file,
  }) => {
    return new Promise((success, failed) => {
      db.query(`SELECT * FROM users WHERE id='${id}'`, (error, result) => {
        if (error) {
          return failed(error.message);
        } else if (result.rows.length == 0) {
          return failed("Id not found!");
        } else {
          db.query(
            `UPDATE users SET name='${
              name || result.rows[0].name
            }', username='${username || result.rows[0].username}', email='${
              email || result.rows[0].email
            }', firstname='${
              firstname || result.rows[0].firstname
            }', lastname='${
              lastname || result.rows[0].lastname
            }', birth_date=$1, mobile_number='${
              mobile_number || result.rows[0].mobile_number
            }', address='${
              address || result.rows[0].address
            }', profile_image='${
              file != undefined ? file.public_id : result.rows[0].profile_image
            }' WHERE id='${id}'`,
            [birth_date || result.rows[0].birth_date],
            (err) => {
              if (err) {
                return failed(err.message);
              } else {
                if (file != undefined) {
                  return success({ oldImage: result.rows[0].profile_image });
                } else {
                  return success("Success update profile!");
                }
              }
            }
          );
        }
      });
    });
  },
};

module.exports = usersModel;
