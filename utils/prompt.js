// Import required modules and functions
const inquirer = require("inquirer");
const connection = require("../db/config"); // Database configuration
const data = require("./department"); // Import data functions from the department module
require("console.table"); // Import console.table for displaying data in tabular format

// Display the main menu, handle user choices, and manage program flow
function menu() {
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
          "Exit Program",
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
        case "Exit Program":
          exitProgram();
          break;
      }
    });
}

// Function to handle program exit
function exitProgram() {
  // Display a goodbye message and close the database connection
  console.log("Thank you for using Employee Tracker. Goodbye! 👋");
  connection.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
  });
}

// Retrieve department data by calling a method from the data module and display it
function viewAllDepartments() {
  // Call the function to get all departments from the data module. Returns a Promise.
  data.viewAllDepartmentsQuery().then((data) => {
    // Map the data to the expected format
    let tableData = data.map((row) => ({
      Department_Id: row.id,
      Department_Name: row.name,
    }));
    console.table(tableData); // Display the department data
    menu(); // Show the main menu and handle user input
  });
}

// Use the department module to add a new department based on user input
function addDepartment() {
  // Ask user for the name of the department
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Department you are adding?",
        name: "name",
      },
    ])
    .then((res) => {
      // Call the method from the Department class to add a department with the provided name
      data
        .addDepartmentQuery(res.name)
        .then(() => {
          console.log("Department Added"); // Log a success message
          menu(); // Show the main menu again
        })
        .catch((err) => {
          console.error(err); // Log and handle errors if any
          menu(); // Show the main menu again
        });
    });
}

// BONUS FUNCTIONS STARTS HERE

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
    const totalSalary = await data.calculateTotalSalaryByDepartmentId(
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

// Export the menu function to be used in other modules
module.exports = { menu };
