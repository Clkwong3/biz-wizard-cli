-- SELECT Queries
-- Retrieve all employees and their roles
SELECT employee.first_name, employee.last_name, role.title
FROM employee
JOIN role ON employee.role_id = role.id;

-- Retrieve employees in a specific department
SELECT employee.first_name, employee.last_name, department.name AS department_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
WHERE department.name = 'Informational Technology';

-- Retrieve all departments and their total salaries
SELECT department.name AS department_name, SUM(role.salary) AS total_salary
FROM department
LEFT JOIN role ON department.id = role.department_id
GROUP BY department_name;

-- INSERT Queries
-- Add a new department
INSERT INTO department (name) VALUES ('Customer Support');

-- Add a new role
INSERT INTO role (title, salary, department_id)
VALUES ('Customer Support Specialist', 42683.00, 10); -- Assuming Customer Support is department_id 10

-- Add a new employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dewey', 'Nehelp', 11, NULL); -- Assuming 'Customer Support Specialist' is role_id 11

-- UPDATE Queries
-- Update an employee's salary
UPDATE employee SET role_id = 12 WHERE id = 15; -- Assuming 'Customer Support Specialist' is role_id 12

-- Update a department's name
UPDATE department SET name = 'Client Services' WHERE id = 10;

-- DELETE Queries
-- Delete an employee by ID
DELETE FROM employee WHERE id = 20;

-- Delete a role and reassign employees to a different role
-- (Ensure that the new role exists before executing this query)
UPDATE employee SET role_id = 13 WHERE role_id = 14; -- Assuming 'Customer Support Manager' is being deleted
DELETE FROM role WHERE id = 14; -- Assuming 'Customer Support Manager' is role_id 14
