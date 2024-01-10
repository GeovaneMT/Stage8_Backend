const sqliteConnection = require("../../dataBase/sqLite")

async function connectDatabase() {
  return await sqliteConnection()
}

async function closeDatabase(database) {
  try {
    await database.close()
    console.log("Database connection closed.")
  } catch (closeError) {
    console.error("Error closing database connection:", closeError)
  }
}

module.exports = { connectDatabase, closeDatabase }
