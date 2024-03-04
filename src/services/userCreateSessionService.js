const { AppError } = require("../utils/AppError")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")
const { compare } = require("bcryptjs")

class UserCreateSessionService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }
  
  async execute({ email, password }) {
    // Fetching user from the database
    console.log("trying to fetch user from database...")
    const user = await this.userRepository.findByEmail(email)
    console.log("user fetched")

    if (!user) {
      console.log("User not found in the database")
      throw new AppError("User not found in the database", 401)
    }

    // Comparing passwords
    const passwordMatch = await compare(password, user.password)
    console.log("validating inputs...")

    if (!passwordMatch) {
      console.log("E-mail and/or password incorrect")
      throw new AppError("E-mail and/or password incorrect.", 401)
    } else {
      console.log(
        `User fetched: id: ${user.id}, name: ${user.name}, email: ${user.email}`
      )
    }

    // Creating JWT token for authentication
    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    console.log(
      `New token created and exported for user id ${user.id}. User logged`
    )

    // Return user and token
    return { user, token }
  }
}

module.exports = { UserCreateSessionService }
