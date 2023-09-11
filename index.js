// Import the application menu module
const prompt = require("./utils/prompt");

// Start the application menu
async function startApp() {
  // Generate the header and display the menu
  const headerData = await prompt.generateHeader();
  if (headerData) {
    console.log(headerData); // Display the header
    prompt.menu(); // Display the menu
  } else {
    console.log("An error occurred while generating the header."); // Handle the error
  }
}

// Call the function to start the application
startApp();
