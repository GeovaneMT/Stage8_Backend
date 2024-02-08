const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuth(request, response, next) {

  console.log(`Auth Middleware started`)

  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT not provided.", 401)
  }

  const [, token] = authHeader.split(" ")

  try {
    const { sub: userId } = verify(token, authConfig.jwt.secret)

    request.user = {
      id: Number(userId),
    }

    console.log(`User Authenticated`)
    return next()

  } catch (error) {
    console.log(`Invalid JWT`)
    throw new AppError("Invalid JWT.", 401)
  }
}

module.exports = ensureAuth