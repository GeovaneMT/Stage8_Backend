const AppError = require("../utils/AppError")
const { connectDatabase, closeDatabase } = require("./assets/database")
const { validateEmail, validateRequiredFields } = require("./assets/userValidation")
const { hashPassword } = require("./assets/passwordHashing")

class CreateUserController {
  async create(request, response) {
    let database
    try {
      console.log("Creating user...")

      const { name, email, password } = request.body
      console.log("Received request body:", request.body)

      if (!email || !validateEmail(email)) {
        throw new AppError("Invalid email format.", 400)
      }

      validateRequiredFields(request.body)

      database = await connectDatabase()
      console.log("Connected to the database.")

      const checkUserExists = await database.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      )

      if (checkUserExists) {
        throw new AppError("This email is already in use.", 409)
      }

      const hashedPassword = await hashPassword(password)
      console.log("Password hashed successfully.")

      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      )
      console.log("User inserted into the database.")

      return response.status(201).json({ message: "User created successfully" })
    } catch (error) {
      console.error("Error occurred:", error.message)

      if (error.message.includes("Failed to connect")) {
        throw new AppError(
          "Failed to connect to the database. Please try again.",
          500
        )
      }

      if (error.message.includes("Failed to execute")) {
        throw new AppError(
          "Failed to execute the database query. Please try again.",
          500
        )
      }

      if (error.message.includes("data and salt arguments required")) {
        const errorMessage =
          process.env.NODE_ENV === "production"
            ? "Failed to create user."
            : "Failed to hash the password. Please try again."

        throw new AppError(errorMessage, 500)
      }

      throw error
    } finally {
      if (database) {
        await closeDatabase(database)
      }
    }
  }
}

module.exports = CreateUserController