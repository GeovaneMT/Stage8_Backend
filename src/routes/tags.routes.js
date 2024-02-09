const { Router } = require("express")
const { TagsController } = require("../controllers")
const ensureAuth = require("../middleware/EnsureAuth")

const tagsRoutes = Router()
const tagsController = new TagsController()

tagsRoutes.get("/",ensureAuth, tagsController.index)

module.exports = tagsRoutes