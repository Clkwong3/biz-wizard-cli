// Import required module
const connection = require("../db/config"); // Database configuration

// Employee class to bundle database queries about the employees
class Employee {
  constructor(connection) {
    this.connection = connection; // Store the database connection
  }

  // Method to retrieve employees with optional department filter
  viewAllEmployeesQuery(departmentId = null) {
    return new Promise((resolve, reject) => {
      // Base SQL query to select employees with optional department filter
      let queryString = `
        SELECT employee.id,
          employee.first_name,
          employee.last_name,
          role.title AS title,
          department.name AS department,
          role.salary AS salary,
          manager.first_name AS manager_first_name,
          manager.last_name AS manager_last_name
        FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee AS manager ON manager.id = employee.manager_id
      `;

      // If a departmentId is provided, add a WHERE clause to filter by department
      if (departmentId !== null) {
        queryString += `
          WHERE role.department_id = ?;
        `;
      }

      // Execute the SQL query to select employees
      this.connection.query(queryString, [departmentId], (err, results) => {
        if (err) {
          // If there's an error, reject the promise and log the error
          console.error("Error fetching employees:", err);
          reject(err);
        } else {
          // If successful, resolve the promise with the fetched data
          resolve(results);
        }
      });
    });
  }

  // Method to add a new employee to the database
  addEmployeeQuery(firstName, lastName, roleId, managerId) {
    return new Promise((resolve, reject) => {
      // SQL query to insert a new employee into the database, including first name, last name, role ID, and manager ID
      const queryString = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?);
      `;

      // Execute the SQL query to insert a new employee
      this.connection.query(
        queryString,
        [firstName, lastName, roleId, managerId],
        (err, result) => {
          if (err) {
            // If there's an error, reject the promise and log the error
            console.error("Error adding employee:", err);
            reject(err);
          } else {
            // If successful, resolve the promise
            resolve(result);
          }
        }
      );
    });
  }

  // Method to update an employee's role in the database
  updateEmployeeRoleQuery(employeeId, newRoleId) {
    return new Promise((resolve, reject) => {
      // SQL query to update a current employee's role by setting the new role ID
      const queryString = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?;
      `;

      // Execute the SQL query to update the employee's role
      this.connection.query(
        queryString,
        [newRoleId, employeeId],
        (err, result) => {
          if (err) {
            // If there's an error, reject the promise and log the error
            console.error("Error updating employee role:", err);
            reject(err);
          } else {
            // If successful, resolve the promise
            resolve(result);
          }
        }
      );
    });
  }

  // BONUS QUERY STARTS HERE

  // Method to update an employee's manager in the database
  updateEmployeeManagerQuery(employeeId, newManagerId) {
    return new Promise((resolve, reject) => {
      // SQL query to update an employee's manager by setting the new manager ID
      const queryString = `
      UPDATE employee
      SET manager_id = ?
      WHERE id = ?;
    `;

      // Execute the SQL query to update the employee's manager
      this.connection.query(
        queryString,
        [newManagerId, employeeId],
        (err, result) => {
          if (err) {
            // If there's an error, reject the promise and log the error
            console.error("Error updating employee manager:", err);
            reject(err);
          } else {
            // If successful, resolve the promise
            resolve(result);
          }
        }
      );
    });
  }

  // Method to retrieve employees by department
  async viewEmployeesByDepartmentQuery(departmentId) {
    return new Promise((resolve, reject) => {
      // SQL query to select employees in the specified department
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

      // Execute the SQL query to select employees by department
      this.connection.query(queryString, [departmentId], (err, results) => {
        if (err) {
          // If there's an error, reject the promise and log the error
          console.error("Error fetching employees by department:", err);
          reject(err);
        } else {
          // If successful, resolve the promise with the fetched data
          resolve(results);
        }
      });
    });
  }

  // Method to delete an employee by its ID
  deleteEmployeeByIdQuery(employeeId) {
    return new Promise((resolve, reject) => {
      // SQL query to delete an employee by its ID
      const queryString = `
        DELETE FROM employee
        WHERE id = ?;
      `;

      // Execute the SQL query to delete the employee
      this.connection.query(queryString, [employeeId], (err, result) => {
        if (err) {
          console.error("Error deleting employee:", err); // If there's an error, reject the promise and log the error
          reject(err);
        } else {
          resolve(result); // If successful, resolve the promise
        }
      });
    });
  }
}

// Export an instance of the Employee class with the configured database connection
module.exports = new Employee(connection);
