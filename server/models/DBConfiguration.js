const mysql = require("mysql");

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
exports.getConnection = function (callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    callback(err, conn);
  });
};
