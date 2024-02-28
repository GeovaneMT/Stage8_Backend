// Importing the custom error class
const { AppError } = require("./AppError")

// Error handling middleware function
const errorHandler = (error, request, response, next) => {
  // If the error is an instance of AppError, handle it with appropriate status code and message
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  // For other errors, log them to the console and return a generic 500 error response
  console.error("Unhandled Error:", error)
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}

// Exporting the errorHandler middleware function
module.exports = errorHandler