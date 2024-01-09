const { hash, compare } = require("bcryptjs")
const AppError = require("../../utils/AppError")
const sqliteConnection = require("../../dataBase/sqLite")

class UpdateUserController {
  async update(request, response) {
    const { name, email, password, old_password } = request.body
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
      throw new AppError("Inputed mail is the same as the current email.", 409)
    }

    // Update user information
    user.name = name
    user.email = email

    // Check if the old pasword is inserted
    if (password && !old_password) {
      throw new AppError("Old password is required", 401)
    }

    // Check if the old pasword is correct
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("Old password incorrect", 401)
      }
      user.password = await hash(password, 8)
    }

    // Check if the updated email is equal to the current email
    if (password === old_password) {
      throw new AppError(
        "Inputed password is the same as the current password.", 409)
    }
    // Update user information
    const updateFields = []
    const updateValues = []

    if (name) {
      updateFields.push("name = ?")
      updateValues.push(user.name)
    }
    if (email) {
      updateFields.push("email = ?")
      updateValues.push(user.email)
    }
    if (password) {
      updateFields.push("password = ?")
      updateValues.push(user.password)
    }

    updateFields.push("updated_at = DATETIME('now')")

    await database.run(
      `
      UPDATE users SET
      ${updateFields.join(", ")}
      WHERE id = ?`,
      [...updateValues, userId]
    )

    // Return success message
    return response.status(200).json({ message: "Info updated successfully" })
  }
}

module.exports = UpdateUserController