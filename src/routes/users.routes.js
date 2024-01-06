const { Router } = require("express")

const usersRoutes = Router()

usersRoutes.post("/", (request, response) => {

  const { user, email, password } = request.body

  response.json({ user, email, password }) //resposta no formato json
  //response.send(`User: ${user}. email: ${email}. password: ${password}`) //resposta no formato HTML
})

module.exports = usersRoutes