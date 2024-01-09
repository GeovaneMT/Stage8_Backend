const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const { requiredFields } = require("./assets/requiredFields")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body
    const database = await sqliteConnection()

    // Check if the user already exists
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!request.body[field.key]) {
        throw new AppError(`${field.fieldName} is required.`, 400)
      }
    })

    // If user already exists, throw an error
    if (checkUserExists) {
      throw new AppError("This email is already in use.", 409)
    }

    // Hash the password
    const hashedPassword = await hash(password, 8)

    // Insert user into the database
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    )

    // Return success message
    return response.status(201).json({ message: "User created successfully" })
  }

  async update(request, response) {
    const { name, email } = request.body
    const { userId } = request.params
    const database = await sqliteConnection()

    // Fetch the existing user by ID
    const user = await database.get("SELECT * FROM users WHERE id = ?", [
      userId,
    ])

    // Fetch the user with the updated email
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = ? AND id <> ?",
      [email, userId]
    )

    // Check if the user exists
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Check if the updated email is already in use
    if (userWithUpdatedEmail) {
      throw new AppError("This email is already in use.", 409)
    }

    // Check if the updated email is equal to the current email
    if (email === user.email) {
      throw new AppError("Updated email is the same as the current email.", 400)
    }

    // Update user information
    user.name = name
    user.email = email

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      updated_at = ?
      WHERE id = ?`,
      [user.name, user.email, new Date(), userId]
    )

    // Return success message
    return response.status(200).json({ message: "Info updated successfully" })
  }
}

module.exports = UsersController