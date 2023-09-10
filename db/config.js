// Import required module
const mysql = require("mysql2");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "R0ot/p4s", // Database password
  database: "business_db", // Database name
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
});

// Export the connection for use in other modules
module.exports = connection;
