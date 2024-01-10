// Import necessary modules and dependencies
const { hash } = require("bcryptjs")
const AppError = require("../../utils/AppError")
const sqliteConnection = require("../../dataBase/sqLite")
const { requiredFields } = require("./requiredFields")

// Define the CreateUserController class
class CreateUserController {
  // Method to handle user creation
  async create(request, response) {
    // Declare a variable to store the database connection
    let database
    try {
      console.log("Creating user...")

      // Extract user information from the request body
      const { name, email, password } = request.body
      console.log("Received request body:", request.body)

      // Validate email presence
      if (!email) {
        throw new AppError("Email is required.", 400)
      }

      // Validate email format using a simple regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format.", 400)
      }

      // Establish a connection to the SQLite database
      database = await sqliteConnection()
      console.log("Connected to the database.")

      // Check if the user already exists in the database
      const checkUserExists = await database.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      )

      // Validate required fields in the request body
      requiredFields.forEach((field) => {
        if (!request.body[field.key]) {
          throw new AppError(`${field.fieldName} is required.`, 400)
        }
      })

      // If user already exists, throw an error
      if (checkUserExists) {
        throw new AppError("This email is already in use.", 409)
      }

      // Hash the password before storing it in the database
      const hashedPassword = await hash(password, 8)
      console.log("Password hashed successfully.")

      // Insert user into the database
      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      )
      console.log("User inserted into the database.")

      // Return success message
      return response.status(201).json({ message: "User created successfully" })
    } catch (error) {
      // Log the error in addition to the error message
      console.error("Error occurred:", error.message)

      // Handle specific errors
      // Handle connection-related errors
      if (error.message.includes("Failed to connect")) {
        throw new AppError(
          "Failed to connect to the database. Please try again.",
          500
        )
      }

      // Handle database query execution errors
      if (error.message.includes("Failed to execute")) {
        throw new AppError(
          "Failed to execute the database query. Please try again.",
          500
        )
      }

      // Handle password hashing errors
      if (error.message.includes("data and salt arguments required")) {
        const errorMessage =
          process.env.NODE_ENV === "production"
            ? "Failed to create user."
            : "Failed to hash the password. Please try again."

        throw new AppError(errorMessage, 500)
      }

      // Re-throw other errors
      throw error
    } finally {
      // Close the database connection in a finally block
      if (database) {
        try {
          await database.close()
          console.log("Database connection closed.")
        } catch (closeError) {
          // Log or handle the error if closing the connection fails
          console.error("Error closing database connection:", closeError)
        }
      }
    }
  }
}

// Export the CreateUserController class
module.exports = CreateUserController