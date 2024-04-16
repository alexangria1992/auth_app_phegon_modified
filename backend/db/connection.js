const mysql = require("mysql2");
const colors = require("colors");
const dotenv = require("dotenv");
require("dotenv").config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASS,
  database: "authenticationapplication",
});

db.getConnection((err, con) => {
  if (err) {
    console.log(`Could not connect to the database ${err}`);
  } else {
    console.log(colors.magenta("Successfully connected to the database"));
  }
});

module.exports = db;
