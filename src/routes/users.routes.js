const { Router } = require("express")
const { createUser, updateUser } = require("../controllers")

const usersRoutes = Router()

usersRoutes.post("/", createUser.create)
usersRoutes.put("/:userId", updateUser.update)

module.exports = usersRoutes