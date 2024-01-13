const knex = require("../../dataBase/knex")

class DeleteNotesController {
  async delete(request, response) {

    const { id } = request.params

    await knex("notes").where({ id }).delete()

    return response.status(201).json()
  }
}

module.exports = DeleteNotesController
