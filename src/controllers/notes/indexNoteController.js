const knex = require("../../dataBase/knex")

async function indexNoteController(request, response) {
    const { title, user_id, tags } = request.query

    let notes

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim())

      notes = await knex("tags").whereIn("name", filterTags)
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }
    
    // Respond with the retrieved notes
    return response.status(200).json(notes)
    
}

module.exports = indexNoteController