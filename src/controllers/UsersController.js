const CreateUserController = require("./assets/CreateUserController")
const UpdateUserController = require("./assets/UpdateUserController")

const createUser = new CreateUserController()
const updateUser = new UpdateUserController()

module.exports = { createUser, updateUser }