const AppError = require("../../utils/AppError")

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateRequiredFields(requestBody) {
  const requiredFields = [
    { key: "name", fieldName: "Name" },
    { key: "email", fieldName: "Email" },
    { key: "password", fieldName: "Password" },
  ]

  requiredFields.forEach((field) => {
    if (!requestBody[field.key]) {
      throw new AppError(`${field.fieldName} is required.`, 400)
    }
  })
}

function validateOldPassword(password, oldPassword) {
  if (password && !oldPassword) {
    throw new AppError("Old password is required", 401)
  }
}

module.exports = { validateEmail, validateRequiredFields, validateOldPassword }