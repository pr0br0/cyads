const { handleApiError, showSuccessMessage } = require('../lib/error-handling.ts');

// Test API error handling
console.log("Testing error handling...");
handleApiError(new Error('This is a test API error'));

// Test success message
showSuccessMessage('Operation completed successfully!');

console.log("Error handling tests completed. Check for toast notifications.");
