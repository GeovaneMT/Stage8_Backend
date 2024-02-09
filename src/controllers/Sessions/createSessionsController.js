const knex = require("../../dataBase/knex")
const AppError = require("../../utils/AppError")
const authConfig = require("../../configs/auth")
const { sign } = require("jsonwebtoken")
const { compare } = require("bcryptjs")
const { validateEmail } = require("../assets/userValidation")


async function createSessionController(request, response) {
  console.log("Logging in ...")

  const { email, password } = request.body
  console.log("Received request from body")

  // Check email format
  console.log("validating email format")
  if (!email || !validateEmail(email)) {
    console.log("error: Invalid email format")
    throw new AppError("Invalid email format.", 400)
  } else {
    console.log("Email format is valid")
  }

  // Fetching user from the database
  const user = await knex("users").where({ email }).first()
  console.log("trying to fetch user from database...")

  // Comparing passwords
  const passwordMatch = await compare(password, user.password)

  console.log("validating inputs")

  // Handling case where user doesn't exist
  if (!user || !passwordMatch) {
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

  // Returning user information along with token
  console.log(`New token created and exported for user id ${user.id}. User logged`)
  return response.json({ user, token })
}

module.exports = createSessionController