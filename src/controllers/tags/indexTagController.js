const knex = require("../../dataBase/knex")

async function indexTagController(request, response) {
  console.log("Indexing Tags")

  const user_id = request.user.id
  const tags = await knex("tags").where({ user_id })

  console.log("Tags Indexed")
  return response.status(200).json(tags)
}

module.exports = indexTagController