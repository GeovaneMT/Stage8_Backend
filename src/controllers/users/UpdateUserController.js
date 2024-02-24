const { connectDatabase, closeDatabase } = require("../assets/database")
const {
  validateEmail,
  validateOldPassword,
} = require("../assets/userValidation")
const { hashPassword, comparePasswords } = require("../assets/passwordHashing")
const AppError = require("../../utils/AppError")

async function UpdateUserController(request, response) {
  const { name, email, password, Old_password } = request.body
  const userId = request.user.id
  const NODE_ENV = process.env.NODE_ENV || "development"
  let database

  function handleDatabaseError(error) {
    // Handle database update errors
    const errorMessage =
      NODE_ENV === "development"
        ? `Error updating user: ${error.message}`
        : "Error updating user information"

    console.log(errorMessage)
    throw new AppError(errorMessage, 500)
  }

  try {
    console.log("Updating user information...")

    // Validate email format
    if (email && !validateEmail(email)) {
      console.log("Invalid email format.")
      throw new AppError("Invalid email format.", 422)
    }

    // Establish a database connection
    database = await connectDatabase()

    // Fetch the existing user by ID
    const user = await database.get("SELECT * FROM users WHERE id = ?", [
      userId,
    ])

    console.log("Fetched existing user:", user.name, userId)

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

    // Update user information
    user.name = name || user.name
    user.email = email || user.email

    // Check if the old password is correct when password is informed
    if (password && Old_password) {

      const isOldPasswordCorrect = await comparePasswords(
        Old_password,
        user.password
      )

      // Hash and update the password if correct
      if (!isOldPasswordCorrect) {
        console.log("Old password incorrect.")
        throw new AppError("Old password incorrect", 401)
      } else {
        user.password = await hashPassword(password)
        console.log("password Hashed and updated.")
      }

    } else if(password && !Old_password) {

      console.log("Old password not informed. info not updated")
      throw new AppError("Old password not informed. info not updated", 401)

    } else if (!password && Old_password){

      console.log("New password not informed. info not updated")
      throw new AppError("New password not informed. info not updated", 401)

    }
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
        handleDatabaseError(error)
      }

    // Return success message
    console.log("Info updated successfully.")
    return response.status(200).json({ message: "Info updated successfully" })
  } finally {
    if (database) {
      await closeDatabase(database)
    }
  }
}

module.exports = UpdateUserController