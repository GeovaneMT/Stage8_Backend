const knex = require("../../dataBase/knex")

async function indexNoteController(request, response) {
  const { title, tags } = request.query
  const user_id = request.user.id
  console.log("Indexing Notes")

  if (tags) {
    const filterTags = tags.split(",").map((tag) => tag.trim())

    notes = await knex("tags")
      .select(["notes.id", "notes.title", "notes.user_id"])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id")
      .orderBy("notes.title")
  } else {
    notes = await knex("notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")
  }

  const userTags = await knex("tags").where({ user_id })
  const notesWithTags = notes.map((note) => {
    const noteTags = userTags.filter((tag) => tag.note_id === note.id)
    return {
      ...note,
      tags: noteTags,
    }
  })
  // Respond with the retrieved notes
  console.log("Note Indexed")
  return response.status(200).json(notesWithTags)
}

module.exports = indexNoteController
