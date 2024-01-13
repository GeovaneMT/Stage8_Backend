const { Router } = require("express")
const { createNote, showNote, deleteNote } = require("../controllers")

const notesRoutes = Router()

notesRoutes.post("/:user_id", createNote.create)
notesRoutes.get("/:id", showNote.show)
notesRoutes.delete("/:id", deleteNote.delete)

module.exports = notesRoutes