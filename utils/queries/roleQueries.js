// Import required module
const connection = require("../../db/config"); // Database configuration

// Role class to bundle database queries about the roles
class Role {
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

  // Method to retrieve all roles from the database
  async viewAllRolesQuery() {
    try {
      const sql = `
        SELECT 
          role.id, 
          role.title, 
          department.name AS department_name, 
          LPAD(CONCAT('$', FORMAT(role.salary, 2)), 11, ' ') AS salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id;
      `;

      const results = await this.executeQuery(sql);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Method to add a new role to the database
  async addRoleQuery(title, salary, departmentId) {
    try {
      const sql = `
        INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?);
      `;

      const result = await this.executeQuery(sql, [
        title,
        salary,
        departmentId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // BONUS FUNCTIONS START HERE

  // Method to delete a role by its ID
  async deleteRoleByIdQuery(roleId) {
    try {
      const sql = `
        DELETE FROM role
        WHERE id = ?;
      `;

      const result = await this.executeQuery(sql, [roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

// Export an instance of the Role class with the configured database connection
module.exports = new Role(connection);
