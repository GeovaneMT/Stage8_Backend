const { Router } = require("express")

const UsersController = require("../controllers/UsersController")

const usersController = new UsersController()

const usersRoutes = Router()

function myMiddleware (request, response, next) {
  console.log("middleware pass")

  console.log("request.body")
  if(!request.body.isAdmin){
    return response.json({message: "user not allowed"})
  }
  console.log("response.body")
  
  next()
}

usersRoutes.post("/", myMiddleware, usersController.create)

module.exports = usersRoutes