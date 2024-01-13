const knex = require("../../dataBase/knex")

async function createNoteController(request, response) {
  try {
    const { title, description, tags, links } = request.body
    const { user_id } = request.params

    // Insert note
    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    })

    // Insert links
    if (links && links.length > 0) {
      const linksInsert = links.map((link) => {
        return {
          note_id,
          url: link,
        }
      })
      await knex("links").insert(linksInsert)
    }

    // Insert tags
    if (tags && tags.length > 0) {
      const tagsInsert = tags.map((name) => {
        return {
          note_id,
          name,
          user_id,
        }
      })
      await knex("tags").insert(tagsInsert)
    }

    return response.status(201).json({ message: "Note created successfully" })
  } catch (error) {
    console.error("Error creating note:", error)

    // Handle specific database-related errors
    if (error.code === "SQLITE_CONSTRAINT") {
      return response
        .status(400)
        .json({ error: "Duplicate entry or constraint violation." })
    }

    // Handle other generic errors
    return response.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = createNoteController