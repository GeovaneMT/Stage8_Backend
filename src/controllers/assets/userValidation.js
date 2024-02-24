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
module.exports = { validateEmail, validateRequiredFields }