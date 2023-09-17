// Import necessary modules and dependencies
const data = require("../queries/departmentQueries");

// Function to fetch department data
async function fetchDepartmentData() {
  try {
    return await data.viewAllDepartmentsQuery();
  } catch (err) {
    handleError(err); // Handle error at a higher level
  }
}

// Function to transform department data for table display
function transformToTableData(data) {
  return data.map((row) => ({
    Department_ID: row.id,
    Department_Name: row.name,
  }));
}

// Function to display department data as a table
function displayTable(data) {
  // Display department data as a table
  console.table(data);
}

// Export the functions to make them available in other modules
module.exports = {
  fetchDepartmentData,
  transformToTableData,
  displayTable,
};
