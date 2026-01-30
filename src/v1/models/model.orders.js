// Imports
const db = require("../helpers/database.connect"); // Database Connection
const { v4: uuidv4 } = require("uuid"); // UUUID ID Generator Package

// Model
const ordersModel = {
  getById: (id) => {
    return new Promise((success, failed) => {
      db.query(
        `SELECT ord.id_order, ord.id_product, ord.size, ord.quantity, ord.total_price, ord.tax, ord.shipping, ord.discount, ord.total, ord.id_user, ord.name, ord.date, ord.delivery, ord.payment_method, p.productname, ord.product_image, u.address, u.mobile_number FROM ((orders AS ord INNER JOIN users AS u ON ord.id_user=$1 AND ord.id_user = u.id) INNER JOIN products AS p ON ord.id_product = p.id)`,
        [id],
        (error, result) => {
          if (error) return failed(error.message);
          if (result.rows.length == 0) return failed("Id not found!");
          return success(result.rows);
        }
      );
    });
  },
  add: ({
    id_product,
    size,
    quantity,
    total_price,
    tax,
    shipping,
    discount,
    id,
    time,
    delivery,
    payment_method,
    product_image,
  }) => {
    return new Promise((success, failed) => {
      db.query(
        `INSERT INTO orders (id, id_product, size, quantity, total_price, tax, shipping, discount, id_user, date, delivery, payment_method, product_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          uuidv4(),
          id_product,
          size,
          quantity,
          parseInt(total_price),
          tax,
          shipping,
          discount,
          id,
          time,
          delivery,
          payment_method,
          product_image,
        ],
        (error) => {
          if (error) return failed(error.message);
          return success("Success order!");
        }
      );
    });
  },
  edit: ({ id, payment_method, status }) => {
    return new Promise((success, failed) => {
      db.query(
        `SELECT * FROM orders WHERE id_order=$1`,
        [id],
        (error, result) => {
          if (error) return failed(error.message);
          if (result.rows.length == 0) return failed("Id not found!");
          db.query(
            `UPDATE orders SET payment_method=$1, status=$2`,
            [
              payment_method || result.rows[0].payment_method,
              status || result.rows[0].status,
            ],
            (err) => {
              if (err) return failed(err.message);
              return success({ id, payment_method, status });
            }
          );
        }
      );
    });
  },
};

module.exports = ordersModel;
