const AppError = require("../../utils/AppError")

function validateFields(fields) {
  fields.forEach(({ field, fieldName }) => {
    if (!field) {
      throw new AppError(`${fieldName} é obrigatório`)
    }
  })
}

module.exports = validateFields
