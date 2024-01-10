const { hash, compare } = require("bcryptjs")

async function hashPassword(password) {
  return await hash(password, 8)
}

async function comparePasswords(oldPassword, hashedPassword) {
  return await compare(oldPassword, hashedPassword)
}

module.exports = { hashPassword, comparePasswords }