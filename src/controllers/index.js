const CreateUserController = require("./users/CreateUserController")
const UpdateUserController = require("./users/UpdateUserController")

const indexNoteController = require("./notes/indexNoteController")
const createNoteController = require("./notes/CreateNotesController")
const ShowNotesController = require("./notes/ShowNotesController")
const DeleteNotesController = require("./notes/DeleteNotesController")

const indexTagController = require("./tags/indexTagController")

class UserController {
  async create(request, response) {
    await CreateUserController(request, response)
  }
  async update(request, response) {
    await UpdateUserController(request, response)
  }
}

class NotesController {
  async index(request, response) {
    await indexNoteController(request, response)
  }
  async create(request, response) {
    await createNoteController(request, response)
  }
  async show(request, response) {
    await ShowNotesController(request, response)
  }
  async delete(request, response) {
    await DeleteNotesController(request, response)
  }
}

class TagsController {
  async index(request, response) {
    await indexTagController(request, response)
  }
}

module.exports = { UserController, NotesController, TagsController }