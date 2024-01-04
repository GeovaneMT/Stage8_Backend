const express = require("express")
const app = express()
app.use(express.json())

app.post("/users", (request, response) => {
  const { user, email, password } = request.body

  //response.send(`User: ${user}. email: ${email}. password: ${password}`) //resposta no formato HTML
  response.json({ user, email, password }) //resposta no formato json
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))