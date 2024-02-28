const { AppError } = require("../../utils/AppError")

function validateEmail(email) {
  console.log("validating Email...")
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  console.log("Email validation result:", isValid)
  return isValid
}

function validateRequiredFields(requestBody) {
  console.log("validating required fields...")
  const requiredFields = [
    { key: "name", fieldName: "Name" },
    { key: "email", fieldName: "Email" },
    { key: "password", fieldName: "Password" },
  ]

  requiredFields.forEach((field) => {
    if (!requestBody[field.key]) {
      // Throw an error if any required field is missing in the request body
      const errorMessage = `${field.fieldName} is required.`
      console.error("Error validating required fields:", errorMessage)
      throw new AppError(errorMessage, 400)
    }
  })
  console.log("All required fields are present.")
}

module.exports = { validateEmail, validateRequiredFields }