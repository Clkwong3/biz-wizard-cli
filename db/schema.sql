-- Drop the database if it exists
DROP DATABASE IF EXISTS business_db;

-- Create the business_db database
CREATE DATABASE business_db;

-- Use the business_db database
USE business_db;

-- Create the 'department' table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create the 'role' table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE -- Cascade deletion if department is deleted
);

-- Create the 'employee' table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE, -- Cascade deletion of employees when a role is deleted
  FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL -- Set manager_id to NULL if the manager is deleted
);