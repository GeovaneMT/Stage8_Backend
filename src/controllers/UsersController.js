const validateFields = require("./logic/validationUtils")
const userFields = require("./assets/userFields")

class UsersController {
  create(request, response) {
    const { name, email, password } = request.body

    const requiredFields = userFields.map(({ field, fieldName }) => ({
      field: request.body[field],
      fieldName,
    }))

    validateFields(requiredFields)

    response.status(201).json({ name, email, password })
  }
}

module.exports = UsersController