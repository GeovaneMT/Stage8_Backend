require("dotenv/config")
require("express-async-errors")

const migrationsRun = require("./database/sqLite/migrations")
const errorHandler = require("./utils/errorMiddleware")
const uploadConfig = require("./configs/upload")

const cors = require("cors")
const express = require("express")
const routes = require("./routes")


// Run database migrations
migrationsRun()

// Initialize Express application
const app = express()
app.use(cors())
app.use(express.json())

// Serve static files
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

// Set up routes
app.use(routes)

// Error handling middleware
app.use(errorHandler)

// Set the port number
const PORT = process.env.PORT || 3333

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})