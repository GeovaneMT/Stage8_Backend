const knex = require("../../dataBase/knex")

async function DeleteNotesController(request, response) {
  try {
    const { id } = request.params

    const deleteCount = await knex("notes").where({ id }).delete()

    if (deleteCount === 0) {
      return response.status(404).json({ error: "Note not found" })
    }

    return response.status(204).json() // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting note:", error)

    // Handle other generic errors
    return response.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = DeleteNotesController