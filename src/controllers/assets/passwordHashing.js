const { hash, compare } = require("bcryptjs")

async function hashPassword(password) {
  try {
    console.log("Hashing password...")
    // Generate a hashed password with a salt factor of 8
    const hashedPassword = await hash(password, 8)
    console.log("Password hashed successfully:", hashedPassword)
    return hashedPassword
  } catch (error) {
    console.error("Error hashing password:", error)
    throw error
  }
}

async function comparePasswords(oldPassword, hashedPassword) {
  try {
    console.log("Comparing password...")
    // Compare the provided password with the hashed password
    const isMatch = await compare(oldPassword, hashedPassword)
    console.log("Passwords compared successfully:", isMatch)
    return isMatch
  } catch (error) {
    console.error("Error comparing passwords:", error)
    throw error
  }
}

module.exports = { hashPassword, comparePasswords }
