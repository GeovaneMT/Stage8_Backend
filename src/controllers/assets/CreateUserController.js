const { hash } = require("bcryptjs")
const AppError = require("../../utils/AppError")
const sqliteConnection = require("../../dataBase/sqLite")
const { requiredFields } = require("./requiredFields")

class CreateUserController {
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
}

module.exports = CreateUserController
