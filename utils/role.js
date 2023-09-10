// Import required module
const connection = require("../db/config"); // Database configuration

// Role class to bundle database queries about the roles
class Role {
  constructor(connection) {
    this.connection = connection; // Store the database connection
  }

  // Method to retrieve all roles from the database
  viewAllRolesQuery() {
    return new Promise((resolve, reject) => {
      // SQL query to retrieve role data including role ID, title, department name, and salary
      const queryString = `
        SELECT role.id, 
          role.title, 
          department.name AS department_name, 
          role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id;
      `;

      // Execute the SQL query to select all roles
      this.connection.query(queryString, (err, results) => {
        if (err) {
          console.error("Error fetching roles:", err); // If there's an error, reject the promise and log the error
          reject(err);
        } else {
          resolve(results); // If successful, resolve the promise with the fetched data
        }
      });
    });
  }

  // Method to add a new role to the database
  addRoleQuery(title, salary, departmentId) {
    return new Promise((resolve, reject) => {
      // SQL query to insert a new role into the database, including title, salary, and department ID
      const queryString = `
        INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?);
      `;

      // Execute the SQL query to insert a new role
      this.connection.query(
        queryString,
        [title, salary, departmentId],
        (err, result) => {
          if (err) {
            console.error("Error adding role:", err); // If there's an error, reject the promise and log the error
            reject(err);
          } else {
            resolve(result); // If successful, resolve the promise
          }
        }
      );
    });
  }

  // BONUS FUNCTIONS STARTS HERE

  // Method to delete a role by its ID
  deleteRoleByIdQuery(roleId) {
    return new Promise((resolve, reject) => {
      // SQL query to delete a role by its ID
      const queryString = `
        DELETE FROM role
        WHERE id = ?;
      `;

      // Execute the SQL query to delete the role
      this.connection.query(queryString, [roleId], (err, result) => {
        if (err) {
          console.error("Error deleting role:", err); // If there's an error, reject the promise and log the error
          reject(err);
        } else {
          resolve(result); // If successful, resolve the promise
        }
      });
    });
  }
}

// Export an instance of the Role class with the configured database connection
module.exports = new Role(connection);
