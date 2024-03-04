const { UserRepository } = require("../../repositories/userRepository")
const { UserCreateSessionService } = require("../../services/userCreateSessionService")

const { AppError } = require("../../utils/AppError")

const { validateEmail } = require("../assets/userValidation")

async function createSessionController(request, response) {
  console.log("Logging in ...")

  const { email, password } = request.body
  console.log("Received request from body")
  console.log(`test email: ${email}, test password ${password}`)

  // Check email format
  console.log("validating email format...")
  if (!email || !validateEmail(email)) {
    console.log("error: Invalid email format")
    throw new AppError("Invalid email format.", 400)
  } else {
    console.log("Email format is valid")
  }

  // Database Connect
  const userRepository = new UserRepository()
  const userCreateSessionService = new UserCreateSessionService(userRepository)
  const { user, token } = await userCreateSessionService.execute({
    email,
    password,
  })

  return response.json({ user, token })
}

module.exports = createSessionController