const { sqliteConnection, closeDatabase } = require("../dataBase/sqLite")
const {
  hashPassword,
  comparePasswords,
} = require("../controllers/assets/passwordHashing")

class UserRepository {
  async findById(userId) {
    let database
    try {
      // Connect to SQLite database
      database = await sqliteConnection()

      console.log("Finding user by ID:", userId)
      // Retrieve user by ID from the database
      const user = await database.get("SELECT * FROM users WHERE id = ?", [
        userId,
      ])
      console.log("User found by ID:", user)
      return user
    } finally {
      // Close the database connection
      await closeDatabase(database)
    }
  }

  async findByEmail(email) {
    let database
    try {
      // Connect to SQLite database
      database = await sqliteConnection()

      console.log("Finding user by email:", email)
      // Retrieve user by email from the database
      const user = await database.get("SELECT * FROM users WHERE email = ?", [
        email,
      ])
      console.log("User found by email:", user)
      return user
    } finally {
      // Close the database connection
      await closeDatabase(database)
    }
  }

  async create({ name, email, password }) {
    let database
    try {
      // Establish connection to SQLite database
      database = await sqliteConnection()
      console.log("Creating new user:", { name, email })
      // Insert new user into the database
      const { lastID: userId } = await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
      )

      // Log success message
      console.log("User successfully inserted into the database")

      return { id: userId }
    } catch (error) {
      // Log error if insertion fails
      console.error("Error inserting user into the database:", error)
      throw error
    } finally {
      // Close the database connection
      await closeDatabase(database)
    }
  }

  async update(user) {
    let database
    try {
      // Connect to SQLite database
      database = await sqliteConnection()

      console.log("Updating user:", user)
      // Update user in the database
      await database.run(
        `
          UPDATE users SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME('now')
          WHERE id = ?`,
        [user.name, user.email, user.password, user.id]
      )
      console.log("User updated successfully")
    } finally {
      // Close the database connection
      await closeDatabase(database)
    }
  }

  async hashAndComparePassword(plainPassword, hashedPassword) {
    // Compare plain password with hashed password
    const isPasswordCorrect = await comparePasswords(
      plainPassword,
      hashedPassword
    )
    console.log("Password comparison result:", isPasswordCorrect)
    return isPasswordCorrect
  }

  async hashPassword(password) {
    // Hash the provided password
    const hashedPassword = await hashPassword(password)
    return hashedPassword
  }
}

module.exports = { UserRepository }