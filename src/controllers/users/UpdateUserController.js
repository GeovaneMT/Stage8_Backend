const { UserRepository } = require("../../repositories/userRepository")
const { UserUpdateService } = require("../../services/userUpdateService")

const { AppError } = require("../../utils/AppError")
const { validateEmail } = require("../assets/userValidation")

async function UpdateUserController(request, response) {
  try {
    console.log("Updating user information...")

    //request from frontend json
    const { name, email, New_password, Old_password } = request.body
    const userId = request.user.id
    console.log(`Fetched userId from request.user.id ${userId}`)

    // Validate email format
    if (email && !validateEmail(email)) {
      console.log("Invalid email format.")
      throw new AppError("Invalid email format.", 422)
    }

    // Database Connect
    const userRepository = new UserRepository()
    const userUpdateService = new UserUpdateService(userRepository)
    await userUpdateService.execute({
      name,
      email,
      New_password,
      Old_password,
      userId,
    })

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
