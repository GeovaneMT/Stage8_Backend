const knex = require("../../dataBase/knex")
const AppError = require("../../utils/AppError")
const authConfig = require("../../configs/auth")
const { sign } = require("jsonwebtoken")
const { compare } = require("bcryptjs")

async function createSessionController(request, response) {
  console.log("Logging in ...")

  // Destructuring request body for email and password
  const { email, password } = request.body
  console.log("Received request body:", { email, password })

  // Fetching user from the database
  const user = await knex("users").where({ email }).first()

  // Handling case where user doesn't exist or password is incorrect
  if (!user || !(await compare(password, user.password))) {
    throw new AppError("E-mail and/or password incorrect.", 401)
  }

  // Creating JWT token for authentication
  const { secret, expiresIn } = authConfig.jwt
  const token = sign({ userId: user.id }, secret, { expiresIn })

  // Returning user information along with token
  return response.json({ user, token })
}

module.exports = createSessionController