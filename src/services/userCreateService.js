const { hashPassword } = require("../controllers/assets/passwordHashing")
const { AppError } = require("../utils/AppError")

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    
    //check if user exists in databse and if email is already in use
    const checkUserExists = await this.userRepository.findByEmail(email)
    if (checkUserExists) {
      throw new AppError("User not created. This email is already in use.", 409)
    }

    //password hashing...
    const hashedPassword = await hashPassword(password)

    const userCreated = await this.userRepository.create({ name, email, password: hashedPassword })

    return userCreated
  }
}
module.exports = { UserCreateService }
