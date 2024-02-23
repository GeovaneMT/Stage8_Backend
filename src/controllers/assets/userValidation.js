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

function validateOldPassword(password, Old_Password) {
  console.log(`validating passes...`)
  if (password && !Old_Password) {
    console.log({ password }, { Old_Password })
    console.log("Old password is incorrect")
    throw new AppError("Old password is incorrect", 401)
  }
}

module.exports = { validateEmail, validateRequiredFields, validateOldPassword }