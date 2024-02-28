const { sqliteConnection } = require("../../../dataBase/sqLite")
const createUsers = require("./createUsers")

async function migrationsRun() {
  try {
    // Await the sqliteConnection function since it returns a promise
    const db = await sqliteConnection()
    const schemas = [createUsers].join("")

    // Execute the schemas
    await db.exec(schemas)
    console.log("Migrations executed successfully.")
  } catch (error) {
    console.error(error)
  }
}

module.exports = migrationsRun
