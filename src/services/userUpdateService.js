const { AppError } = require("../utils/AppError")

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, New_password, Old_password, userId }) {
    // Fetch the existing user by ID
    const user = await this.userRepository.findById(userId)

    if (!user) {
      console.log("User not found.")
      throw new AppError("User not found", 404)
    }

    // Fetch the user with the updated email
    const userWithUpdatedEmail = await this.userRepository.findByEmail(email)

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
      const isOldPasswordCorrect = await this.userRepository.ComparePasswords(
        Old_password,
        user.password
      )

      // Hash and update the password if correct
      if (!isOldPasswordCorrect) {
        console.log("Old password incorrect.")
        throw new AppError("Old password incorrect", 401)
      } else {
        const hashedPassword = await this.userRepository.hashPassword(
          New_password
        )
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
    const userUpdated = await this.userRepository.update( user )
    
    return userUpdated
  }
}
module.exports = { UserUpdateService }
