const knex = require("../../dataBase/knex")
const AppError = require("../../utils/AppError")

async function DeleteNotesController(request, response) {
  try {
    console.log("Deleting note")

    const { id } = request.params

    const deleteCount = await knex("notes").where({ id }).delete()

    if (deleteCount === 0) {
      return response.status(404).json({ error: "Note not found" })
    }

    console.log("Note Deleted")
    return response.status(204).json() // 204 No Content for successful deletion
  } catch (error) {
    throw new AppError("Error deleting note:", error)

    // Handle other generic errors
    return response.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = DeleteNotesController