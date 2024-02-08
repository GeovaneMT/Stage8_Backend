const knex = require("../../dataBase/knex")
const AppError = require("../utils/AppError")

async function ShowNotesController(request, response) {
  try {
    console.log("Showing Notes")
    const { id } = request.params

    // Fetch note
    const note = await knex("notes").where({ id }).first()

    if (!note) {
      return response.status(404).json({ error: "Note not found" })
    }

    // Fetch tags
    const tags = await knex("tags").where({ note_id: id }).orderBy("name")

    // Fetch links
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at")

    console.log("Note Showed")
    return response.status(200).json({
      ...note,
      tags,
      links,
    })
  } catch (error) {
    throw new AppError("Error fetching note:", error)

    // Handle other generic errors
    return response.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = ShowNotesController