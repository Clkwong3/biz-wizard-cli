// Import required modules and functions
const inquirer = require("inquirer");
const figlet = require("figlet");
const util = require("util"); // Import the 'util' module for promisify
require("console.table"); // Import console.table for displaying data in tabular format

const figletAsync = util.promisify(figlet); // Promisify the figlet function to use async/await
const connection = require("../db/config"); // Database configuration
const data = require("./queries/departmentQueries"); // Import data functions from the department module
const role = require("./queries/roleQueries"); // Import role functions from the role module
const employee = require("./queries/employeeQueries"); // Import employee functions from the employee module

const departmentFunctions = require("./functions/departmentFunctions"); // Import department-related functions
const employeeFunctions = require("./functions/employeeFunctions"); // Import employee-related functions
const roleFunctions = require("./functions/roleFunctions"); // Import role-related functions

// Function to generate the header
async function generateHeader() {
  try {
    // Use async/await to generate the header text
    const header = await figletAsync("Employer Tracker");
    return header;
  } catch (err) {
    console.log("Error:", err); // Log any errors
    return null;
  }
}

// Display the main menu, handle user choices, and manage program flow
function menu() {
  generateHeader(); // Display the header

  // Prompt the user to select an option from the menu
  inquirer
    .prompt([
      // Menu choices for the user
      {
        type: "list",
        name: "menu",
        message: "Select an option:",
        choices: [
          // List of available actions
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee's role",
          "Update an employee's manager",
          "View employees by manager",
          "View employees by department",
          "View department budget",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
          "Close Program",
        ],
      },
    ])
    .then((answers) => {
      // Based on the user's choice, call the corresponding function
      switch (answers.menu) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee's role":
          updateEmployeeRole();
          break;
        case "Update an employee's manager":
          updateEmployeeManager();
          break;
        case "View employees by manager":
          viewByManager();
          break;
        case "View employees by department":
          viewByDepartment();
          break;
        case "View department budget":
          viewDepartmentBudget();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Close Program":
          closeProgram();
          break;
      }
    });
}

// Function to handle program exit
function closeProgram() {
  // Display a goodbye message and close the database connection
  console.log("\nThank you for using Employee Tracker. Goodbye! 👋");
  connection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
      return;
    } else {
      console.log("Database connection closed.\n");
    }
  });
}

// Function to handle cancellation
function handleCancellation(operationName) {
  console.log(`\n${operationName} canceled. Going back to the main menu.\n`);
  showMainMenu();
}

// Error handling function
function handleError(err) {
  // Handle and log errors
  console.error(err);
}

// Show main menu
function showMainMenu() {
  menu();
}
//------------------ View All Departments -------------------------------------------
// Retrieve and display all department data
async function viewAllDepartments() {
  try {
    // Fetch department data
    const departmentData = await departmentFunctions.fetchDepartmentData();

    // Transform data for table display
    const tableData = departmentFunctions.transformToTableData(departmentData);

    // Add an empty line for spacing
    console.log("\n");

    // Display department data
    departmentFunctions.displayTable(tableData);

    // Show Main Menu
    showMainMenu();
  } catch (err) {
    // Handle errors
    handleError(err);
    showMainMenu();
  }
}
//------------------ Add Departments -------------------------------------------
// Prompt the user for a department name
async function promptForDepartmentName() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Enter the Department name:",
        name: "name",
        validate: (value) =>
          value.trim() === "" ? "Please enter a department name." : true,
      },
    ]);
    return answers.name;
  } catch (err) {
    handleError(err);
  }
}

// Add a new department based on user input
async function addDepartment() {
  try {
    // Prompt the user for the department name
    const departmentName = await promptForDepartmentName();

    // Add the department with the provided name
    await data.addDepartmentQuery(departmentName);
    console.log("\nDepartment Added Successfully\n");

    // Show the main menu
    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ View All Roles -------------------------------------------
// Fetch all role data from the role module
async function fetchRoleData() {
  try {
    return await role.viewAllRolesQuery();
  } catch (err) {
    handleError(err);
  }
}

// Transform role data for display
function transformRoleDataForDisplay(role) {
  return role.map((row) => ({
    Role_ID: row.id,
    Role_Title: row.title,
    Salary: row.salary,
    Department_name: row.department_name,
  }));
}

// Display role data as a table
function displayRoleTable(role) {
  // Display role data as a table
  console.table(role);
}

// Retrieve and display all role data
async function viewAllRoles() {
  try {
    // Fetch all role data
    const roleData = await fetchRoleData();

    // Transform data for display
    const tableData = transformRoleDataForDisplay(roleData);

    // Add an empty line for spacing
    console.log("\n");

    // Display role data
    displayRoleTable(tableData);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ Add Roles -------------------------------------------
// Create department choices for user
function createDepartmentChoices(departments) {
  return departments.map((departments) => ({
    name: departments.name,
    value: departments.id,
  }));
}

// Create department choices for user
function createDepartmentChoices(departments) {
  return departments.map((departments) => ({
    name: departments.name,
    value: departments.id,
  }));
}

// Prompt user for role details: title, salary, department
async function promptForRoleDetails(departmentChoices) {
  try {
    departmentChoices.push({ name: "Cancel", value: "cancel" });

    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Role Title:",
        name: "title",
        validate: (value) =>
          value.trim() === "" ? "Please enter a role title." : true,
      },
      {
        type: "input",
        message: "Role Salary:",
        name: "salary",
        validate: (value) =>
          isNaN(value) || Number(value) <= 0
            ? "Please enter a valid positive salary."
            : true,
      },
      {
        type: "list",
        message: "Select the department for the role:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);
    return answers;
  } catch (err) {
    handleError(err);
  }
}

// Add a role with provided details
async function addRoleWithDetails(title, salary, departmentId) {
  try {
    await role.addRoleQuery(title, salary, departmentId);
    console.log("\nRole Added Successfully\n");
  } catch (err) {
    handleError(err);
  }
}

// Add a new role based on user input
async function addRole() {
  try {
    // Fetch department data for user choice
    const departments = await departmentFunctions.fetchDepartmentData();

    // Create department choices for user
    const departmentChoices = createDepartmentChoices(departments);

    // Prompt user for role details
    const answer = await promptForRoleDetails(departmentChoices);

    // Check if the selected department is 'cancel'
    if (answer.departmentId === "cancel") {
      handleCancellation("Role creation");
      return;
    }

    // Add a role with provided details
    await addRoleWithDetails(answer.title, answer.salary, answer.departmentId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ View All Employees -------------------------------------------
// Fetch all employee data from employee module
async function fetchEmployeeData() {
  try {
    return await employee.viewAllEmployeesQuery();
  } catch (err) {
    handleError(err);
  }
}

// Transform employee data for display
function transformEmployeeDataForDisplay(employee) {
  return employee.map((row) => ({
    Employee_ID: row.id,
    First_Name: row.first_name,
    Last_Name: row.last_name,
    Title: row.title,
    Department: row.department,
    Salary: row.salary,
    Manager: row.manager ? row.manager : "No Manager", // Replace null manager info with "No Manager"
  }));
}

// Display employee data as a table
function displayEmployeeTable(employee) {
  // Display employee data as a table
  console.table(employee);
}

// Display all employees
async function viewAllEmployees() {
  try {
    // Fetch all employee data
    const employeeData = await fetchEmployeeData();

    // Transform the data for display
    const tableData = transformEmployeeDataForDisplay(employeeData);

    // Add empty lines for spacing
    console.log("\n");

    // Display employee data
    displayEmployeeTable(tableData);

    menu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ Add Employees -------------------------------------------
// Create user choices for roles
function createUserRoleChoices(roles) {
  return roles.map((role) => ({
    name: role.title,
    value: role.id,
  }));
}

// Create user choices for managers (including "No Manager" option)
function createUserManagerChoices(employees) {
  const managerChoices = employees
    .filter(
      (employee) => !employee.manager_first_name || !employee.manager_last_name
    )
    .map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

  // Add the "No Manager" option to the managerChoices array
  managerChoices.unshift({ name: "No Manager", value: null });

  return managerChoices;
}

// Prompt the user for employee details
async function promptForEmployeeDetails(roleChoices, managerChoices) {
  try {
    roleChoices.push({ name: "Cancel", value: "cancel" });
    managerChoices.push({ name: "Cancel", value: "cancel" });

    const answer = await inquirer.prompt([
      {
        type: "input",
        message: "First name:",
        name: "firstName",
        validate: (value) =>
          value.trim() === "" ? "Please enter the first name." : true,
      },
      {
        type: "input",
        message: "Last name:",
        name: "lastName",
        validate: (value) =>
          value.trim() === "" ? "Please enter the last name." : true,
      },
      {
        type: "list",
        message: "Select the role:",
        name: "roleId",
        choices: roleChoices,
      },
      {
        type: "list",
        message: "Select the manager (if applicable):",
        name: "managerId",
        choices: managerChoices,
      },
    ]);
    return answer;
  } catch (err) {
    handleError(err);
  }
}

// Add an employee with provided details
async function addEmployeeWithDetails(firstName, lastName, roleId, managerId) {
  try {
    await employee.addEmployeeQuery(firstName, lastName, roleId, managerId);
    console.log("\nEmployee Added Successfully\n");
  } catch (err) {
    handleError(err);
  }
}

// Add a new employee based on user input
async function addEmployee() {
  try {
    // Fetch roles and existing employees
    const roles = await fetchRoleData();
    const employees = await fetchEmployeeData();

    // Create user choices for roles and managers
    const roleChoices = createUserRoleChoices(roles);
    const managerChoices = createUserManagerChoices(employees);

    // Prompt for employee details
    const answer = await promptForEmployeeDetails(roleChoices, managerChoices);

    // Check if the selected role is 'cancel'
    if (answer.roleId === "cancel") {
      handleCancellation("Employee creation");
      return;
    }

    // Add an employee with provided details
    await addEmployeeWithDetails(
      answer.firstName,
      answer.lastName,
      answer.roleId,
      answer.managerId
    );

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}

//------------------ Update Employee's Role -------------------------------------------
// Create user choices for employees
function createUserEmployeeChoices(employee) {
  return employee.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
}

// Prompt the user for employee and new role details
async function promptForEmployeeAndRole(employeeChoices, roleChoices) {
  try {
    employeeChoices.push({ name: "Cancel", value: "cancel" });
    roleChoices.push({ name: "Cancel", value: "cancel" });

    const answer = await inquirer.prompt([
      {
        type: "list",
        message: "Select the employee you want to update:",
        name: "employeeId",
        choices: employeeChoices,
      },
      {
        type: "list",
        message: "Select the new role for the employee:",
        name: "newRoleId",
        choices: roleChoices,
      },
    ]);
    return answer;
  } catch (err) {
    handleError(err);
  }
}

// Update an employee's role
async function updateEmployeeRoleWithDetails(employeeId, newRoleId) {
  try {
    await employee.updateEmployeeRoleQuery(employeeId, newRoleId);
    console.log("\nEmployee Role Updated Successfully`\n");
  } catch (err) {
    handleError(err);
  }
}

// Update an employee's role based on user input
async function updateEmployeeRole() {
  try {
    // Fetch a list of roles and employees
    const roles = await fetchRoleData();
    const employees = await fetchEmployeeData();

    // Create user choices for roles and employees
    const roleChoices = createUserRoleChoices(roles);
    const employeeChoices = createUserEmployeeChoices(employees);

    // Prompt the user for employee and new role details
    const answer = await promptForEmployeeAndRole(employeeChoices, roleChoices);

    // Check if the selected employee or role is 'cancel'
    if (answer.employeeId === "cancel" || answer.newRoleId === "cancel") {
      handleCancellation("Employee role update");
      return;
    }

    // Update the employee's role with provided details
    await updateEmployeeRoleWithDetails(answer.employeeId, answer.newRoleId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//----------------------------------------------------------------------------------------
// BONUS FUNCTIONS STARTS HERE
//------------------ Update Employee's Manager -------------------------------------------
// Filter out the selected employee from manager choices
function filterManagerChoices(managerChoices, selectedEmployeeId) {
  return managerChoices.filter((choice) => choice.value !== selectedEmployeeId);
}

// Prompt for selecting an employee to update
async function promptForEmployeeToUpdate(employeeChoices) {
  try {
    employeeChoices.push({ name: "Cancel", value: "cancel" });

    const answer = await inquirer.prompt([
      {
        type: "list",
        message: "Select the employee you want to update:",
        name: "employeeId",
        choices: employeeChoices,
      },
    ]);
    return answer;
  } catch (error) {
    handleError(error);
  }
}

// Prompt for selecting a new manager for the employee
async function promptForNewManager(managerChoices) {
  managerChoices.push({ name: "Cancel", value: "cancel" });

  const managerInput = await inquirer.prompt([
    {
      type: "list",
      message: "Select the new manager for the employee:",
      name: "managerId",
      choices: managerChoices,
    },
  ]);
  return managerInput;
}

// Update an employee's manager
async function updateEmployeeManagerWithDetails(employeeId, newManagerId) {
  try {
    await employee.updateEmployeeManagerQuery(employeeId, newManagerId);
    console.log("\nEmployee Manager Updated Successfully\n");
  } catch (err) {
    handleError(err);
  }
}

// Update an employee's manager based on user input
async function updateEmployeeManager() {
  try {
    // Fetch a list of employees
    const employees = await fetchEmployeeData();

    // Create user choices for selecting an employee
    const employeeChoices = createUserEmployeeChoices(employees);

    // Prompt for selecting an employee to update
    const answer = await promptForEmployeeToUpdate(employeeChoices);

    // Filter out the selected employee from manager choices
    const managerChoices = filterManagerChoices(
      employeeChoices,
      answer.employeeId
    );

    // Prompt for selecting a new manager for the employee
    const managerInput = await promptForNewManager(managerChoices);

    // Check if the selected employee or role is 'cancel'
    if (answer.employeeId === "cancel" || managerInput.managerId === "cancel") {
      handleCancellation("Employee role update");
      return;
    }

    // Update the employee's manager with provided details
    await updateEmployeeManagerWithDetails(
      answer.employeeId,
      managerInput.managerId
    );

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ View Employees By Manager -------------------------------------------
// Organize employees by their managers
function organizeEmployeesByManager(employees, managerIdMap) {
  const managerChoicesArray = [];

  employees.forEach((emp) => {
    if (
      emp.manager_first_name &&
      emp.manager_last_name &&
      emp.id !== emp.manager_id
    ) {
      const managerName = `${emp.manager_first_name} ${emp.manager_last_name}`;
      if (!managerIdMap[managerName]) {
        managerIdMap[managerName] = managerIdMap[managerName]
          ? [...managerIdMap[managerName], emp.manager_id]
          : [emp.manager_id];
        managerChoicesArray.push(managerName);
      }
    }
  });

  // Modify the creation of managerChoices to include unique managers
  const managerChoices = [...new Set(managerChoicesArray)].map((manager) => ({
    name: manager,
    value: managerIdMap[manager],
  }));

  return managerChoices;
}

// Prompt the user to select a manager
async function promptForManagerSelection(managerChoices) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      message:
        "Select a manager to view their employees (Only managers with employees will show):",
      name: "managerId",
      choices: managerChoices,
    },
  ]);
  return answer;
}

// Filter employees based on the selected manager
function filterEmployeesByManager(employees, managerId, managerIdMap) {
  return employees.filter((emp) => {
    const managerName = `${emp.manager_first_name} ${emp.manager_last_name}`;
    return managerIdMap[managerName] === managerId;
  });
}

// Display the list of employees managed by the selected manager
function displayEmployees(employeesByManager) {
  if (employeesByManager.length === 0) {
    console.log("\nNo employees found for this manager.\n");
  } else {
    // Display employees managed by the selected manager
    console.table(
      employeesByManager.map((emp) => ({
        ID: emp.id,
        First_Name: emp.first_name,
        Last_Name: emp.last_name,
        Title: emp.title,
        Department: emp.department,
        Salary: emp.salary,
      }))
    );
  }
}

// Main function to view employees by manager
async function viewByManager() {
  try {
    // Fetch a list of employees
    const employees = await fetchEmployeeData();

    // Declare and initialize managerIdMap
    const managerIdMap = {};

    // Organize employees by their managers and get manager choices
    const managerChoices = organizeEmployeesByManager(employees, managerIdMap);

    // Prompt for selecting a manager
    const answer = await promptForManagerSelection(managerChoices);

    // Filter employees based on the selected manager
    const employeesByManager = filterEmployeesByManager(
      employees,
      answer.managerId,
      managerIdMap
    );

    // Display employees managed by the selected manager
    displayEmployees(employeesByManager);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ View Employees By Department -------------------------------------------
// Prompt the user to select a department
async function promptForDepartmentSelection(departmentChoices) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      message: "Select a department to view its employees:",
      name: "departmentId",
      choices: departmentChoices,
    },
  ]);
  return answer.departmentId;
}

// Fetch employees by department
async function fetchEmployeesByDepartment(departmentId) {
  return await employee.viewByDepartmentQuery(departmentId);
}

// Display employees
function displayEmployees(employees) {
  if (employees.length === 0) {
    console.log("\nNo employees found for this department.\n");
  } else {
    console.log("\n");

    // Display employees in the selected department
    console.table(
      employees.map((emp) => ({
        Id: emp.id,
        First_Name: emp.first_name,
        Last_Name: emp.last_name,
        Title: emp.title,
        Salary: emp.salary,
      }))
    );
  }
}

// View employees by department
async function viewByDepartment() {
  try {
    // Fetch a list of departments
    const departments = await departmentFunctions.fetchDepartmentData();

    // Create user choices for selecting a department
    const departmentChoices = departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    // Prompt for selecting a department
    const departmentId = await promptForDepartmentSelection(departmentChoices);

    // Fetch employees in the selected department
    const employeesByDepartment = await fetchEmployeesByDepartment(
      departmentId
    );

    // Display employees
    displayEmployees(employeesByDepartment);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ View Department's Budget ---------------------------------------
// Fetch department choices for user selection
async function fetchDepartmentChoices() {
  try {
    // Fetch a list of departments from the data module
    const departments = await data.viewAllDepartmentsQuery();
    return departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));
  } catch (err) {
    handleError(err);
  }
}

// Prompt the user to select a department
async function promptForDepartmentSelection(departmentChoices) {
  try {
    // Prompt the user to select a department from the choices
    const departmentResponse = await inquirer.prompt([
      {
        type: "list",
        message: "Select a department to view its budget:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);
    return departmentResponse.departmentId;
  } catch (err) {
    handleError(err);
  }
}

// Calculate and display the department's total budget
async function calculateAndDisplayBudget(departmentId) {
  try {
    // Calculate the total salary budget for the selected department
    const totalSalary = await data.calculateTotalSalaryByDepartmentIdQuery(
      departmentId
    );

    // Display the total budget of the department
    console.log(`\nTotal Budget of the Department: $${totalSalary}\n`);
  } catch (err) {
    handleError(err);
  }
}

// View department budget
async function viewDepartmentBudget() {
  try {
    // Fetch department choices for user selection
    const departmentChoices = await fetchDepartmentChoices();

    // Prompt the user to select a department
    const departmentId = await promptForDepartmentSelection(departmentChoices);

    // Calculate and display the budget for the selected department
    await calculateAndDisplayBudget(departmentId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ Delete a Department ------------------------------------
// Create an array of department choices for the user
function createDepartmentChoices(departments) {
  return departments.map((department) => ({
    name: `${department.id} - ${department.name}`,
    value: department.id,
  }));
}

// Prompt the user to select a department for deletion
async function promptForDepartmentSelection(departmentChoices) {
  try {
    departmentChoices.push({ name: "Cancel", value: "cancel" });

    const response = await inquirer.prompt([
      {
        type: "list",
        message: "Select a department to delete:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);

    return response.departmentId;
  } catch (err) {
    handleError(err);
  }
}

// Delete the department with the provided ID
async function deleteDepartmentById(departmentId) {
  try {
    await data.deleteDepartmentByIdQuery(departmentId);
    console.log(`\nDepartment Deleted Successfully\n`);
  } catch (err) {
    handleError(err);
  }
}

// Handle the deletion process
async function deleteDepartment() {
  try {
    const departments = await departmentFunctions.fetchDepartmentData();
    const departmentChoices = createDepartmentChoices(departments);
    const departmentId = await promptForDepartmentSelection(departmentChoices);

    if (departmentId === "cancel") {
      handleCancellation("Deletion");
      return;
    }

    await deleteDepartmentById(departmentId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ Delete a Role ------------------------------------
// Create an array of role choices based on Role IDs
function createRoleChoices(roles) {
  return roles.map((role) => ({
    name: `${role.id} - ${role.title}`,
    value: role.id,
  }));
}

// Prompt the user to select the Role for deletion
async function promptForRoleSelection(roleChoices) {
  try {
    roleChoices.push({ name: "Cancel", value: "cancel" });

    const response = await inquirer.prompt([
      {
        type: "list",
        message: "Select the Role to delete:",
        name: "roleId",
        choices: roleChoices,
      },
    ]);

    return response.roleId;
  } catch (err) {
    handleError(err);
  }
}

//Delete the role with the provided ID
async function deleteRoleById(roleId) {
  try {
    await role.deleteRoleByIdQuery(roleId);
    console.log(`\nRole Deleted Successfully\n`);
  } catch (err) {
    handleError(err);
  }
}

// Handle the deletion process
async function deleteRole() {
  try {
    const roles = await fetchRoleData();
    const roleChoices = createRoleChoices(roles);
    const roleId = await promptForRoleSelection(roleChoices);

    if (roleId === "cancel") {
      handleCancellation("Deletion");
      return;
    }

    await deleteRoleById(roleId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//------------------ Delete an Employee ------------------------------------
// Create an array of employee choices based on Employee IDs
function createEmployeeChoices(employees) {
  return employees.map((employee) => ({
    name: `${employee.id} - ${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
}

// Prompt the user to select the Employee for deletion
async function promptForEmployeeSelection(employeeChoices) {
  try {
    employeeChoices.push({ name: "Cancel", value: "cancel" });

    const response = await inquirer.prompt([
      {
        type: "list",
        message: "Select an Employee to delete:",
        name: "employeeId",
        choices: employeeChoices,
      },
    ]);

    return response.employeeId;
  } catch (err) {
    handleError(err);
  }
}

// Delete the employee with the provided ID
async function deleteEmployeeById(employeeId) {
  try {
    await employee.deleteEmployeeByIdQuery(employeeId);
    console.log(`\nEmployee Deleted Successfully\n`);
  } catch (err) {
    handleError(err);
  }
}

// Handle the deletion process
async function deleteEmployee() {
  try {
    const employees = await fetchEmployeeData();
    const employeeChoices = createEmployeeChoices(employees);
    const employeeId = await promptForEmployeeSelection(employeeChoices);

    if (employeeId === "cancel") {
      handleCancellation("Deletion");
      return;
    }

    await deleteEmployeeById(employeeId);

    showMainMenu();
  } catch (err) {
    handleError(err);
    showMainMenu();
  }
}
//----------------------------------------------------------------
// Export the generateHeader function to be used in index.js
module.exports = { generateHeader, menu };
