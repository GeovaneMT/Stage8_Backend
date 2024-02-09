require("express-async-errors")

const PORT = 3333

const errorHandler = require("./utils/errorMiddleware")
const uploadConfig = require("./configs/upload")

const migrationsRun = require("./database/sqLite/migrations")

const express = require("express")

const routes = require("./routes")

const app = express()

migrationsRun()

app.use(express.json())
app.use(routes)

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
