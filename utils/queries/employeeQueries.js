// Import required module
const connection = require("../../db/config"); // Database configuration

// Employee class to bundle database queries about the employees
class Employee {
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

  // Method to retrieve employees with optional department filter
  async viewAllEmployeesQuery(departmentId = null) {
    try {
      let queryString = `
      SELECT 
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title AS title,
        department.name AS department,
        LPAD(CONCAT('$', FORMAT(role.salary, 2)), 11, ' ') AS salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON manager.id = employee.manager_id
    `;

      if (departmentId !== null) {
        queryString += `
          WHERE role.department_id = ?;
        `;
      }

      const results = await this.executeQuery(queryString, [departmentId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Method to add a new employee to the database
  async addEmployeeQuery(firstName, lastName, roleId, managerId) {
    try {
      const queryString = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?);
      `;

      const result = await this.executeQuery(queryString, [
        firstName,
        lastName,
        roleId,
        managerId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Method to update an employee's role in the database
  async updateEmployeeRoleQuery(employeeId, newRoleId) {
    try {
      const queryString = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?;
      `;

      const result = await this.executeQuery(queryString, [
        newRoleId,
        employeeId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // BONUS QUERY STARTS HERE

  // Method to update an employee's manager in the database
  async updateEmployeeManagerQuery(employeeId, newManagerId) {
    try {
      const queryString = `
      UPDATE employee
      SET manager_id = ?
      WHERE id = ?;
    `;

      const result = await this.executeQuery(queryString, [
        newManagerId,
        employeeId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Method to retrieve employees by department
  async viewByDepartmentQuery(departmentId) {
    try {
      const queryString = `
      SELECT employee.id,
        employee.first_name,
        employee.last_name,
        role.title AS title,
        role.salary AS salary
      FROM employee
        INNER JOIN role ON employee.role_id = role.id
      WHERE role.department_id = ?;
    `;

      const results = await this.executeQuery(queryString, [departmentId]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete an employee by its ID
  async deleteEmployeeByIdQuery(employeeId) {
    try {
      const queryString = `
      DELETE FROM employee
      WHERE id = ?;
    `;

      const result = await this.executeQuery(queryString, [employeeId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

// Export an instance of the Employee class with the configured database connection
module.exports = new Employee(connection);
