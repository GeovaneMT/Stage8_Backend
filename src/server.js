require('express-async-errors')

const PORT = 3333

const errorHandler = require('./utils/errorMiddleware');

const migrationsRun = require('./database/sqLite/migrations')

const express = require('express')

const routes = require('./routes')

const app = express()

migrationsRun()

app.use(express.json())
app.use(routes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})