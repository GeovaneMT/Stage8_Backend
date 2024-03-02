const CreateUserController = require("./users/CreateUserController")
const UpdateUserController = require("./users/UpdateUserController")

const indexNoteController = require("./notes/indexNoteController")
const CreateNoteController = require("./notes/CreateNotesController")
const ShowNotesController = require("./notes/ShowNotesController")
const DeleteNotesController = require("./notes/DeleteNotesController")

const indexTagController = require("./tags/indexTagController")

const createSessionController = require("./sessions/createSessionController")

const UpdateAvatarController = require("./avatar/UpdateAvatarController")

class UserController {
  async create(request, response) {
    await CreateUserController(request, response)
  }
  async update(request, response) {
    await UpdateUserController(request, response)
  }
}

class AvatarController {
  async update(request, response) {
    await UpdateAvatarController(request, response)
  }
}

class NotesController {
  async index(request, response) {
    await indexNoteController(request, response)
  }
  async create(request, response) {
    await CreateNoteController(request, response)
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

class SessionsController {
  async create(request, response) {
    await createSessionController(request, response)
  }
}

module.exports = {
  UserController,
  NotesController,
  TagsController,
  SessionsController,
  AvatarController,
}