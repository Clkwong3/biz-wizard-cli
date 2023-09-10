// Import required module
const connection = require("../db/config"); // Database configuration

// Department class to bundle database queries about the departments
class Department {
  constructor(connection) {
    this.connection = connection; // Store the database connection
  }

  viewAllDepartmentsQuery() {
    return new Promise((resolve, reject) => {
      // Execute the SQL query to select all departments
      this.connection.query(`SELECT * FROM department;`, (err, results) => {
        if (err) {
          // If there's an error, reject the promise and log the error
          console.error("Error fetching departments:", err);
          reject(err);
        } else {
          // If successful, resolve the promise with the fetched data
          resolve(results);
        }
      });
    });
  }

  // Method to add a new department to the database
  addDepartmentQuery(data) {
    return new Promise((resolve, reject) => {
      // Execute the SQL query to insert a new department
      this.connection.query(
        `INSERT INTO department (name) VALUES (?)`,
        [data],
        (err, result) => {
          if (err) {
            // If there's an error, reject the promise and log the error
            console.error("Error adding department:", err);
            reject(err);
          } else {
            // If successful, resolve the promise
            resolve(result);
          }
        }
      );
    });
  }

  // BONUS FUNCTIONS STARTS HERE

  // Method to calculate total salary by department ID
  calculateTotalSalaryByDepartmentIdQuery(departmentId) {
    return new Promise((resolve, reject) => {
      // Execute the SQL query to calculate the salary
      const query = `
      SELECT SUM(r.salary) AS total_salary
      FROM employee e
      JOIN role r ON e.role_id = r.id
      WHERE r.department_id = ?
    `;

      this.connection.query(query, [departmentId], (err, results) => {
        if (err) {
          // If there's an error, reject the promise and log the error
          console.error("Error calculating department salary:", err);
          reject(err);
        } else {
          // If successful, resolve the promise
          const totalSalary = results[0].total_salary;
          resolve(totalSalary);
        }
      });
    });
  }

  // Method to delete a department by ID
  deleteDepartmentByIdQuery(departmentId) {
    return new Promise((resolve, reject) => {
      // Execute the SQL query to delete the department
      this.connection.query(
        `DELETE FROM department WHERE id = ?`,
        [departmentId],
        (err, result) => {
          if (err) {
            // If there's an error, reject the promise and log the error
            console.error("Error deleting department:", err);
            reject(err);
          } else {
            // If successful, resolve the promise
            resolve(result);
          }
        }
      );
    });
  }
}

// Export an instance of the Department class with the configured database connection
module.exports = new Department(connection);
