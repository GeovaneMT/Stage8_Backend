const AppError = require("../../utils/AppError")
const knex = require("../../dataBase/knex")
const DiskStorage = require("../../providers/DiskStorage")

async function UpdateAvatarController(request, response) {
  console.log("Avatar upload initiated...")

  const userId = request.user.userId
  const avatarFilename = request.file.filename

  const diskStorage = new DiskStorage()

  try {
    // Fetching user from the database
    const user = await knex("users").where({ id: userId }).first()
    console.log("Trying to fetch user from the database...")

    // Handling case where user doesn't exist
    if (!user) {
      console.log("Error: User not authenticated")
      throw new AppError("Error: User not authenticated.", 401)
    } else {
      console.log(
        `User fetched: id: ${user.id}, name: ${user.name}, email: ${user.email}`
      )
    }

    console.log("Fetching avatar...")

    // Handling case where avatar already exists
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
      console.log("Previous avatar deleted")
    } else {
      console.log("No previous avatar found")
    }

    const filename = await diskStorage.saveFile(avatarFilename)
    user.avatar = filename

    // Update user avatar in the database
    await knex("users").where({ id: userId }).update({ avatar: filename })

    // Sending success response
    console.log("Avatar updated successfully.")
    response.json({ message: "Avatar updated successfully.", avatar: filename })
  } catch (error) {
    console.error("Error while updating avatar:", error)
    response.status(error.statusCode || 500).json({ message: error.message })
  }
}

module.exports = UpdateAvatarController