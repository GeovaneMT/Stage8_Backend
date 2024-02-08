const { Router } = require("express")
const { SessionsController } = require("../controllers")

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post("/", sessionsController.create)

module.exports = sessionsRoutes