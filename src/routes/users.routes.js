const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const { UserController } = require("../controllers")
const { AvatarController } = require("../controllers")
const ensureAuth = require("../middleware/EnsureAuth")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const userController = new UserController()
const avatarController = new AvatarController()

usersRoutes.post("/", userController.create)
usersRoutes.put("/", ensureAuth, userController.update)

usersRoutes.patch(
  "/avatar",
  ensureAuth,
  upload.single("avatar"),
  avatarController.update
)

module.exports = usersRoutes
