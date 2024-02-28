const { UserRepository } = require("../../repositories/userRepository")
const { AppError } = require("../../utils/AppError")
const { validateEmail } = require("../assets/userValidation")

async function UpdateUserController(request, response) {
  const { name, email, New_password, Old_password } = request.body
  const userId = request.user.id

  try {
    console.log("Updating user information...")

    // Validate email format
    if (email && !validateEmail(email)) {
      console.log("Invalid email format.")
      throw new AppError("Invalid email format.", 422)
    }

    // Database Connect
    const userRepository = new UserRepository()

    // Fetch the existing user by ID
    const user = await userRepository.findById(userId)

    if (!user) {
      console.log("User not found.")
      throw new AppError("User not found", 404)
    }

    // Fetch the user with the updated email
    const userWithUpdatedEmail = await userRepository.findByEmail(email)

    // Check if the updated email is already in use
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== userId) {
      console.log("This email is already in use.")
      throw new AppError("This email is already in use.", 409)
    }

    // Update user information
    user.name = name || user.name
    user.email = email || user.email

    // Check if the old password is correct when password is informed
    if (New_password && Old_password) {
      const isOldPasswordCorrect = await userRepository.hashAndComparePassword(
        Old_password,
        user.password
      )
      // Hash and update the password if correct
      if (!isOldPasswordCorrect) {
        console.log("Old password incorrect.")
        throw new AppError("Old password incorrect", 401)
      } else {
        const hashedPassword = await userRepository.hashPassword(New_password)
        user.password = hashedPassword
      }
    } else if (New_password && !Old_password) {
      console.log("Old password not informed. Info not updated.")
      throw new AppError("Old password not informed. Info not updated.", 401)
    } else if (!New_password && Old_password) {
      console.log("New password not informed. Info not updated.")
      throw new AppError("New password not informed. Info not updated.", 401)
    }

    // Update user information in the database
    await userRepository.update(user)

    // Return success message
    console.log("Info updated successfully.")
    return response.status(200).json({ message: "Info updated successfully" })
  } catch (error) {
    // Handle errors
    console.error("Error updating user information:", error)
    throw error
  }
}

module.exports = UpdateUserController
