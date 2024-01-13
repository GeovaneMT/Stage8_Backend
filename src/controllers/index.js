const CreateUserController = require("./users/CreateUserController")
const UpdateUserController = require("./users/UpdateUserController")

const CreateNotesController = require("./notes/CreateNotesController")
const ShowNotesController = require("./notes/ShowNotesController")
const DeleteNotesController = require("./notes/DeleteNotesController")

const createUser = new CreateUserController()
const updateUser = new UpdateUserController()

const createNote = new CreateNotesController()
const showNote = new ShowNotesController()
const deleteNote = new DeleteNotesController()

module.exports = { createUser, updateUser, createNote, showNote, deleteNote }
