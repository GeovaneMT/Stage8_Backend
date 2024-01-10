// Import necessary dependencies and modules
const { hash, compare } = require("bcryptjs")
const AppError = require("../../utils/AppError")
const sqliteConnection = require("../../dataBase/sqLite")
const { NODE_ENV } = process.env // Access the NODE_ENV environment variable

// Define a class for updating user information
class UpdateUserController {
  // Define an asynchronous method for updating user information
  async update(request, response) {
    // Destructure data from the request body and parameters
    const { name, email, password, old_password } = request.body
    const userId = request.params.userId // Ensure consistent use of userId
    let database

    try {
      console.log("Updating user information...")

      // Validate email format
      if (email && !isValidEmail(email)) {
        console.log("Invalid email format.")
        throw new AppError("Invalid email format.", 422)
      }

      // Establish a database connection
      database = await sqliteConnection()

      // Fetch the existing user by ID
      const user = await database.get("SELECT * FROM users WHERE id = ?", [
        userId,
      ])

      console.log("Fetched existing user:", user)

      // Fetch the user with the updated email
      const userWithUpdatedEmail = await database.get(
        "SELECT * FROM users WHERE email = ? AND id <> ?",
        [email, userId]
      )

      // Check if the user exists
      if (!user) {
        console.log("User not found.")
        throw new AppError("User not found", 404)
      }

      console.log("User exists.")

      // Check if the updated email is already in use
      if (userWithUpdatedEmail) {
        console.log("This email is already in use.")
        throw new AppError("This email is already in use.", 409)
      }

      console.log("Email is not in use by another user.")

      // Check if the updated email is equal to the current email
      if (email === user.email) {
        console.log("Inputted email is the same as the current email.")
        throw new AppError(
          "Inputted email is the same as the current email.",
          409
        )
      }

      console.log("Email is different from the current email.")

      // Update user information
      user.name = name ?? user.name
      user.email = email ?? user.email

      // Check if the old password is inserted
      if (password && !old_password) {
        console.log("Old password is required.")
        throw new AppError("Old password is required", 401)
      }

      console.log("Checking old password...")

      // Check if the old password is correct
      if (password && old_password) {
        const isOldPasswordCorrect = await compare(old_password, user.password)

        if (!isOldPasswordCorrect) {
          console.log("Old password incorrect.")
          throw new AppError("Old password incorrect", 401)
        }

        // Hash and update the password
        try {
          user.password = await hash(password, 8)
        } catch (error) {
          // Handle password hashing errors
          const errorMessage =
            NODE_ENV === "development"
              ? `Error hashing password: ${error.message}`
              : "Error updating password"

          console.log(errorMessage)
          throw new AppError(errorMessage, 500)
        }
      }

      console.log("Old password is correct.")

      // Check if the updated password is the same as the current password
      if (password === old_password) {
        // Provide a detailed error message only in the development environment
        const errorMessage =
          NODE_ENV === "development"
            ? "Inputted password is the same as the current password."
            : "Error updating password"

        console.log(errorMessage)
        throw new AppError(errorMessage, 409)
      }

      console.log("Updated password is different from the current password.")

      // Update user information in the database
      try {
        await database.run(
          `
          UPDATE users SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME('now')
          WHERE id = ?`,
          [user.name, user.email, user.password, userId]
        )

        console.log("User information updated successfully.")
      } catch (error) {
        // Handle database update errors
        const errorMessage =
          NODE_ENV === "development"
            ? `Error updating user: ${error.message}`
            : "Error updating user information"

        console.log(errorMessage)
        throw new AppError(errorMessage, 500)
      }

      // Return success message
      console.log("Info updated successfully.")
      return response.status(200).json({ message: "Info updated successfully" })
    } finally {
      // Close the database connection in the finally block
      if (database) {
        console.log("Closing database connection.")
        database.close()
      }
    }
  }
}

// Export the UpdateUserController class
module.exports = UpdateUserController

// Helper function to validate email format
function isValidEmail(email) {
  // Use a regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}