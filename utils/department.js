// Import required module
const connection = require("../db/config"); // Database configuration

// Department class to bundle database queries about the departments
class Department {
  constructor(connection) {
    this.connection = connection; // Store the database connection
  }

  // Custom function to execute SQL queries with error handling
  executeQuery(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          console.error("Database Query Error:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Method to view all departments
  async viewAllDepartmentsQuery() {
    try {
      const sql = "SELECT * FROM department";
      const results = await this.executeQuery(sql);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Method to add a new department
  async addDepartmentQuery(data) {
    try {
      const sql = "INSERT INTO department (name) VALUES (?)";
      const result = await this.executeQuery(sql, [data]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // BONUS FUNCTIONS START HERE

  // Method to calculate total salary by department ID
  async calculateTotalSalaryByDepartmentIdQuery(departmentId) {
    try {
      const sql = `
        SELECT SUM(r.salary) AS total_salary
        FROM employee e
        JOIN role r ON e.role_id = r.id
        WHERE r.department_id = ?
        `;

      const results = await this.executeQuery(sql, [departmentId]);
      return results[0].total_salary;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete a department by ID
  async deleteDepartmentByIdQuery(departmentId) {
    try {
      const sql = "DELETE FROM department WHERE id = ?";
      const result = await this.executeQuery(sql, [departmentId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

// Export an instance of the Department class with the configured database connection
module.exports = new Department(connection);
