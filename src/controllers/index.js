const CreateUserController = require("./CreateUserController")
const UpdateUserController = require("./UpdateUserController")

const createUser = new CreateUserController()
const updateUser = new UpdateUserController()

module.exports = { createUser, updateUser }