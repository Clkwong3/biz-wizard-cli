// Import required modules and functions
const inquirer = require("inquirer");
const figlet = require("figlet");
const util = require("util"); // Import the 'util' module for promisify
require("console.table"); // Import console.table for displaying data in tabular format

const connection = require("../db/config"); // Database configuration
const data = require("./department"); // Import data functions from the department module
const role = require("./role"); // Import role functions from the role module
const employee = require("./employee"); // Import employee functions from the employee module

// Promisify the figlet function to use async/await
const figletAsync = util.promisify(figlet);

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
  console.log("Thank you for using Employee Tracker. Goodbye! 👋");
  connection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
      return;
    } else {
      console.log("Database connection closed.");
    }
  });
}
//----------------------------------------------------------------
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
// Fetch department data from data module
async function fetchDepartmentData() {
  try {
    return await data.viewAllDepartmentsQuery();
  } catch (err) {
    throw err; // Handle error at a higher level
  }
}

// Transform department data for table display
function transformToTableData(data) {
  return data.map((row) => ({
    Department_ID: row.id,
    Department_Name: row.name,
  }));
}

// Display department data as a table
function displayTable(data) {
  // Add empty lines for spacing
  console.log("\n");

  // Display department data as a table
  console.table(data);
}

// Retrieve and display all department data
async function viewAllDepartments() {
  try {
    // Fetch department data
    const departmentData = await fetchDepartmentData();

    // Transform data for table display
    const tableData = transformToTableData(departmentData);

    // Display department data
    displayTable(tableData);

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
}

// Add a department with the provided name
async function addDepartmentWithName(name) {
  try {
    await data.addDepartmentQuery(name);
    console.log("Department Added Successfully");
  } catch (err) {
    throw err; // Handle errors at a higher level
  }
}

// Add a new department based on user input
async function addDepartment() {
  try {
    // Prompt the user for the department name
    const departmentName = await promptForDepartmentName();

    // Add the department with the provided name
    await addDepartmentWithName(departmentName);

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
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
    throw err;
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
  // Add empty lines for spacing
  console.log("\n");

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

    // Display role data
    displayRoleTable(tableData);

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
    handleError(err);
    showMainMenu();
  }
}
//------------------ Add Roles -------------------------------------------
// Fetch department data for user choices
async function fetchDepartmentsForChoices() {
  try {
    return await data.viewAllDepartmentsQuery();
  } catch (err) {
    throw err; // Re-throw error to a different function to deal with it furthur
  }
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
}

// Add a role with the provide details
async function addRoleWithDetails(title, salary, departmentId) {
  try {
    await role.addRoleQuery(title, salary, departmentId);
    console.log("Role Added Successfully");
  } catch (err) {
    throw err;
  }
}

// Add a new role based on user input
async function addRole() {
  try {
    // Fetch department data for user choice
    const departments = await fetchDepartmentsForChoices();

    // Create department choices for user
    const departmentChoices = createDepartmentChoices(departments);

    // Prompt user for role details
    const answers = await promptForRoleDetails(departmentChoices);

    // Add a role with provided details
    await addRoleWithDetails(
      answers.title,
      answers.salary,
      answers.departmentId
    );

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
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
    throw err; // Re-throw the error
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
    Manager:
      row.manager_first_name && row.manager_last_name
        ? row.manager_first_name + " " + row.manager_last_name
        : "No Manager", // Replace null manager info with "No Manager"
  }));
}

// Display employee data as a table
function displayEmployeeTable(employee) {
  // Add empty lines for spacing
  console.log("\n");

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

    // Display employee data
    displayEmployeeTable(tableData);

    menu();
  } catch (err) {
    // Handle errors
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
  const userInputs = await inquirer.prompt([
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

  return userInputs;
}

// Add an employee with provided details
async function addEmployeeWithDetails(firstName, lastName, roleId, managerId) {
  try {
    await employee.addEmployeeQuery(firstName, lastName, roleId, managerId);
    console.log("Employee Added");
  } catch (err) {
    throw err;
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
    const userInputs = await promptForEmployeeDetails(
      roleChoices,
      managerChoices
    );

    // Add an employee with provided details
    await addEmployeeWithDetails(
      userInputs.firstName,
      userInputs.lastName,
      userInputs.roleId,
      userInputs.managerId
    );

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
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
  const answers = await inquirer.prompt([
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
  return answers;
}

// Update an employee's role
async function updateEmployeeRoleWithDetails(employeeId, newRoleId) {
  try {
    await employee.updateEmployeeRoleQuery(employeeId, newRoleId);
    console.log("Employee Role Updated");
  } catch (err) {
    throw err;
  }
}

// Update an employee's role based on user input
async function updateEmployeeRole() {
  try {
    // Fetch a list of employees and roles
    const employees = await fetchEmployeeData();
    const roles = await fetchRoleData();

    // Create user choices for employees and roles
    const employeeChoices = createUserEmployeeChoices(employees);
    const roleChoices = createUserRoleChoices(roles);

    // Prompt the user for employee and new role details
    const userInputs = await promptForEmployeeAndRole(
      employeeChoices,
      roleChoices
    );

    // Update the employee's role with provided details
    await updateEmployeeRoleWithDetails(
      userInputs.employeeId,
      userInputs.newRoleId
    );

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
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

// Update an employee's manager
async function updateEmployeeManagerWithDetails(employeeId, newManagerId) {
  try {
    await employee.updateEmployeeManagerQuery(employeeId, newManagerId);
    console.log("Employee Manager Updated");
  } catch (err) {
    throw err; // Re-throw the error for higher-level handling
  }
}

// Prompt for selecting an employee to update
async function promptForEmployeeToUpdate(employeeChoices) {
  const userInput = await inquirer.prompt([
    {
      type: "list",
      message: "Select the employee you want to update:",
      name: "employeeId",
      choices: employeeChoices,
    },
  ]);
  return userInput;
}

// Prompt for selecting a new manager for the employee
async function promptForNewManager(managerChoices) {
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

// Update an employee's manager based on user input
async function updateEmployeeManager() {
  try {
    // Fetch a list of employees
    const employees = await fetchEmployeeData();

    // Create user choices for selecting an employee
    const employeeChoices = createUserEmployeeChoices(employees);

    // Prompt for selecting an employee to update
    const userInput = await promptForEmployeeToUpdate(employeeChoices);

    // Filter out the selected employee from manager choices
    const managerChoices = filterManagerChoices(
      employeeChoices,
      userInput.employeeId
    );

    // Prompt for selecting a new manager for the employee
    const managerInput = await promptForNewManager(managerChoices);

    // Update the employee's manager with provided details
    await updateEmployeeManagerWithDetails(
      userInput.employeeId,
      managerInput.managerId
    );

    // Add empty lines for spacing
    console.log("\n");

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
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

// Function to prompt the user to select a manager
async function promptForManagerSelection(managerChoices) {
  const userInput = await inquirer.prompt([
    {
      type: "list",
      message:
        "Select a manager to view their employees (Only managers with employees will show):",
      name: "managerId",
      choices: managerChoices,
    },
  ]);
  return userInput;
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
    console.log("No employees found for this manager.");
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
    const userInput = await promptForManagerSelection(managerChoices);

    // Filter employees based on the selected manager
    const employeesByManager = filterEmployeesByManager(
      employees,
      userInput.managerId,
      managerIdMap
    );

    // Display employees managed by the selected manager
    displayEmployees(employeesByManager);

    // Show the main menu
    showMainMenu();
  } catch (err) {
    // Handle errors
    handleError(err);
    showMainMenu();
  }
}
//------------------ View Employees By Department -------------------------------------------
// Prompt the user to select a department
async function promptForDepartmentSelection(departmentChoices) {
  const userInput = await inquirer.prompt([
    {
      type: "list",
      message: "Select a department to view its employees:",
      name: "departmentId",
      choices: departmentChoices,
    },
  ]);
  return userInput.departmentId;
}

// Fetch employees by department
async function fetchEmployeesByDepartment(departmentId) {
  return await employee.viewByDepartmentQuery(departmentId);
}

// Display employees
function displayEmployees(employees) {
  if (employees.length === 0) {
    console.log("No employees found for this department.");
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
    const departments = await fetchDepartmentData();

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

    // Show Main Menu
    showMainMenu();
  } catch (err) {
    // Handle errors
    handleError(err);
    showMainMenu();
  }
}
//------------------ View Departments Budget ---------------------------------------
// Modify the viewDepartmentBudget function
async function viewDepartmentBudget() {
  try {
    // Fetch data from the data module
    const departments = await data.viewAllDepartmentsQuery();

    // Create department choices for user selection
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const departmentResponse = await inquirer.prompt([
      {
        type: "list",
        message: "Select a department to view its budget:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);

    // Call the calculateTotalSalaryByDepartmentId method with the selected department ID
    const totalSalary = await data.calculateTotalSalaryByDepartmentIdQuery(
      departmentResponse.departmentId
    );

    console.log(`Total Budget of the Department: $${totalSalary}`);
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}
//----------------------------------------------------------------
// Delete by department
async function deleteDepartment() {
  try {
    // Fetch the list of departments from the database
    const departments = await data.viewAllDepartmentsQuery();

    // Create an array of department choices for the user
    const departmentChoices = departments.map((department) => ({
      name: `${department.id} - ${department.name}`,
      value: department.id,
    }));

    // Add a "Cancel" option to the list of choices
    departmentChoices.push({ name: "Cancel", value: "cancel" });

    // Prompt the user to select a department for deletion
    const res = await inquirer.prompt([
      {
        type: "list",
        message: "Select a department to delete:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);

    // Check if the user selected "Cancel"
    if (res.departmentId === "cancel") {
      console.log("Operation canceled. Going back to the main menu.");
      menu(); // Go back to the main menu
      return; // Exit the function
    }

    // Call the delete function with the provided department ID
    await data.deleteDepartmentByIdQuery(res.departmentId);

    // Log a success message and show the main menu
    console.log("Department Deleted");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}
//----------------------------------------------------------------
// Delete a role
async function deleteRole() {
  try {
    // Fetch all role data from the database
    const roles = await role.viewAllRolesQuery();

    // Create an array of role choices based on the available Role IDs
    const roleChoices = roles.map((role) => ({
      name: `${role.id} - ${role.title}`,
      value: role.id,
    }));

    // Add a "Cancel" option to the list of choices
    roleChoices.push({ name: "Cancel", value: "cancel" });

    // Prompt the user to select the Role to delete
    const res = await inquirer.prompt([
      {
        type: "list",
        message: "Select the Role to delete:",
        name: "roleId",
        choices: roleChoices,
      },
    ]);

    // Check if the user selected "Cancel"
    if (res.roleId === "cancel") {
      console.log("Operation canceled. Going back to the main menu.");
      menu(); // Go back to the main menu
      return; // Exit the function
    }

    // Call the deleteRoleById method with the provided role ID
    await role.deleteRoleByIdQuery(res.roleId);

    // Log a success message and show the main menu
    console.log("Role Deleted");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}
//----------------------------------------------------------------
// Delete an employee
async function deleteEmployee() {
  try {
    // Fetch all employee data from the database using the correct module (employee)
    const employees = await employee.viewAllEmployeesQuery();

    // Create an array of employees choices based on the available Employee IDs
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.id} - ${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    // Add a "Cancel" option to the list of choices
    employeeChoices.push({ name: "Cancel", value: "cancel" });

    // Prompt the user to select the Employee to delete
    const res = await inquirer.prompt([
      {
        type: "list",
        message: "Select an Employee to delete:",
        name: "employeeId",
        choices: employeeChoices,
      },
    ]);

    // Check if the user selected "Cancel"
    if (res.employeeId === "cancel") {
      console.log("Operation canceled. Going back to the main menu.");
      menu(); // Go back to the main menu
      return; // Exit the function
    }

    // Call the deleteEmployeeById method with the provided employee ID
    await employee.deleteEmployeeByIdQuery(res.employeeId);

    // Log a success message and show the main menu
    console.log("Employee Deleted");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}
//----------------------------------------------------------------
// Export the generateHeader function to be used in index.js
module.exports = { generateHeader, menu };
