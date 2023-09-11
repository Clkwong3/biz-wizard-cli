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
  // Display the header
  generateHeader();

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
          viewEmployeesByManager();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
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

// Handle errors
function handleError(err) {
  // Handle and log errors
  console.error(err);
}

// Show main menu
function showMainMenu() {
  menu();
}

// View all departments
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

// Add a new department based on user input
async function addDepartment() {
  try {
    // Prompt the user for the department name
    const res = await inquirer.prompt([
      {
        type: "input",
        message: "Enter the Department name:",
        name: "name",
        validate: (value) =>
          value.trim() === "" ? "Please enter a department name." : true,
      },
    ]);

    // Call the method to add a department with the provided name
    await data.addDepartmentQuery(res.name);

    // Add empty lines for spacing
    console.log("\n");

    // Log a success message and show the main menu
    console.log("Department Added");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// Retrieve role data and display it
async function viewAllRoles() {
  try {
    // Fetch all role data from the role module
    const moduleData = await role.viewAllRolesQuery();

    // Transform the data for display
    const tableData = moduleData.map((row) => ({
      Role_ID: row.id,
      Role_Title: row.title,
      Salary: row.salary,
      Department_Name: row.department_name,
    }));

    // Add empty lines for spacing
    console.log("\n");

    // Display department data as a table and show the main menu
    console.table(tableData);
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// Add a new role based on user input
async function addRole() {
  try {
    // Fetch department data for user choices
    const departments = await data.viewAllDepartmentsQuery();

    // Create department choices for user selection
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    // Prompt user for role details: title, salary, department
    const res = await inquirer.prompt([
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

    // Add a role with provided details
    await role.addRoleQuery(res.title, res.salary, res.departmentId);

    // Add empty lines for spacing
    console.log("\n");

    // Log a success message and show the main menu
    console.log("Role Added");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// Display all employees
async function viewAllEmployees() {
  try {
    // Fetch all employee data from the employee module
    const moduleData = await employee.viewAllEmployeesQuery();

    // Transform the data for display
    const tableData = moduleData.map((row) => ({
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

    // Add empty lines for spacing
    console.log("\n");

    // Display department data as a table and show the main menu
    console.table(tableData);
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// Add an employee based on user input
async function addEmployee() {
  try {
    // Fetch roles and existing employees
    const roles = await role.viewAllRolesQuery();
    const employees = await employee.viewAllEmployeesQuery();

    // Create user choices for roles
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Create manager choices for employees without a manager (null value)
    const managerChoices = employees
      .filter(
        (employee) =>
          !employee.manager_first_name || !employee.manager_last_name
      ) // Filter employees without a manager
      .map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

    // Add the "No Manager" option to the managerChoices array
    managerChoices.unshift({ name: "No Manager", value: null });

    // Prompt for employee details
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

    // Add an employee with provided details
    await employee.addEmployeeQuery(
      userInputs.firstName,
      userInputs.lastName,
      userInputs.roleId,
      userInputs.managerId
    );

    // Add empty lines for spacing
    console.log("\n");

    // Log a success message and show the main menu
    console.log("Employee Added");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// Update an employee's role based on user input
async function updateEmployeeRole() {
  try {
    // Fetch a list of employees and roles to choose from
    const employees = await employee.viewAllEmployeesQuery();
    const roles = await role.viewAllRolesQuery();

    // Define choices for employees and roles
    const employeeChoice = employees.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    const roleChoice = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Prompt the user for employee and new role details
    const res = await inquirer.prompt([
      {
        type: "list",
        message: "Select the employee you want to update:",
        name: "employeeId",
        choices: employeeChoice,
      },
      {
        type: "list",
        message: "Select the new role for the employee:",
        name: "newRoleId",
        choices: roleChoice,
      },
    ]);

    // Call the function to update the employee's role
    await employee.updateEmployeeRoleQuery(res.employeeId, res.newRoleId);

    // Add empty lines for spacing
    console.log("\n");

    // Log a success message and show the main menu
    console.log("Employee Role Updated");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// BONUS FUNCTIONS STARTS HERE

// Update an employee's manager
async function updateEmployeeManager() {
  try {
    // Fetch a list of employees to choose from
    const employees = await employee.viewAllEmployeesQuery();

    // Create user choices for selecting an employee and a new manager
    const employeeChoices = employees.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    // Prompt for the employee to update
    const userInput = await inquirer.prompt([
      {
        type: "list",
        message: "Select the employee you want to update:",
        name: "employeeId",
        choices: employeeChoices,
      },
    ]);

    // Filter out the selected employee from the choices for the new manager
    const managerChoices = employeeChoices.filter(
      (choice) => choice.value !== userInput.employeeId
    );

    // Prompt for selecting the new manager for the employee
    const managerInput = await inquirer.prompt([
      {
        type: "list",
        message: "Select the new manager for the employee:",
        name: "managerId",
        choices: managerChoices,
      },
    ]);

    // Call the function to update the employee's manager
    await employee.updateEmployeeManagerQuery(
      userInput.employeeId,
      managerInput.managerId
    );

    // Add empty lines for spacing
    console.log("\n");

    // Log a success message and show the main menu
    console.log("Employee Manager Updated");
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// View employees by manager
async function viewEmployeesByManager() {
  try {
    // Fetch a list of employees to choose from
    const employees = await employee.viewAllEmployeesQuery();

    // Create an array to store manager names and their corresponding manager IDs
    const managerChoicesArray = [];
    const managerIdMap = {};

    // Populate the managerMap
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

    // Add empty lines for spacing
    console.log("\n");

    // Prompt for selecting a manager
    const userInput = await inquirer.prompt([
      {
        type: "list",
        message: "Select a manager to view their employees:",
        name: "managerId",
        choices: managerChoices,
      },
    ]);

    // Add empty lines for spacing
    console.log("\n");

    // Filter employees based on the selected manager
    const employeesByManager = employees.filter((emp) => {
      const managerName = `${emp.manager_first_name} ${emp.manager_last_name}`;
      return managerIdMap[managerName] === userInput.managerId;
    });

    if (employeesByManager.length === 0) {
      console.log("No employees found for this manager.");
    } else {
      // Display employees managed by the selected manager
      console.table(
        employeesByManager.map((emp) => ({
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          title: emp.title,
          department: emp.department,
          salary: emp.salary,
        }))
      );
    }

    // Add empty lines for spacing
    console.log("\n");

    // Show the main menu
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

// View employees by department
async function viewEmployeesByDepartment() {
  try {
    // Fetch a list of departments to choose from
    const departments = await data.viewAllDepartmentsQuery();

    // Create user choices for selecting a department
    const departmentChoices = departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    // Prompt for selecting a department
    const userInput = await inquirer.prompt([
      {
        type: "list",
        message: "Select a department to view its employees:",
        name: "departmentId",
        choices: departmentChoices,
      },
    ]);

    // Fetch all employees in the selected department
    const employeesByDepartment = await employee.viewEmployeesByDepartmentQuery(
      userInput.departmentId
    );

    if (employeesByDepartment.length === 0) {
      console.log("No employees found for this department.");
    } else {
      // Display employees in the selected department
      console.table(
        employeesByDepartment.map((emp) => ({
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          title: emp.title,
          salary: emp.salary,
        }))
      );
    }

    // Show the main menu
    menu();
  } catch (err) {
    // Handle and log errors, then show the main menu
    console.error(err);
    menu();
  }
}

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

// Export the generateHeader function to be used in index.js
module.exports = { generateHeader, menu };
