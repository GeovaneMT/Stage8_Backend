const sqlite3 = require("sqlite3")
const sqlite = require("sqlite")
const path = require("path")

async function sqliteConnection() {
  try {
    console.log(" connecting to Database...")
    // Establish connection to SQLite database
    const database = await sqlite.open({
      filename: path.resolve(__dirname, "..", "database.db"),
      driver: sqlite3.Database,
    })
    console.log("Database connection established.")
    return database
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

async function closeDatabase(database) {
  try {
    console.log("closing connection to Database...")
    if (database) {
      await database.close()
      console.log("Database connection closed.")
    } else {
      console.log("No database connection to close.")
    }
  } catch (error) {
    console.error("Error closing database connection 1:", error)
    throw error
  }
}

module.exports = { sqliteConnection, closeDatabase }