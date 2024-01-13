const knex = require("../../dataBase/knex")

async function indexNoteController(request, response) {
    const { user_id } = request.query

    // Retrieve notes for the specified user_id and order them by title
    const notes = await knex("notes").where({ user_id }).orderBy("title")

    // Respond with the retrieved notes
    return response.status(200).json(notes)
    
}

module.exports = indexNoteController