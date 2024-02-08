const { Router } = require("express")
const { UserController } = require("../controllers");
const ensureAuth = require("../middleware/EnsureAuth")

const usersRoutes = Router()
const userController = new UserController()

usersRoutes.post("/", userController.create)
usersRoutes.put("/", ensureAuth, userController.update)

module.exports = usersRoutes