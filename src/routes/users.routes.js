const { Router } = require("express")
const { UserController } = require("../controllers")

const usersRoutes = Router()
const userController = new UserController()

usersRoutes.post("/", userController.create)
usersRoutes.put("/:userId", userController.update)

module.exports = usersRoutes