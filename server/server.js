const express = require('express')
const app = express()
require('express-async-errors')
const sequelize = require('./db')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// ROUTES
const contentProvider = require('./routes/content-provider')
const job = require('./routes/job')

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//REQUEST HANDLERS
app.use('/api/v1/contentProvider', contentProvider)
app.use('/api/v1/job', job)

// ERROR HANDLING MIDDLEWARE
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    app.listen(port, async () => {
      await sequelize.authenticate()
      await sequelize.sync({ force: false })
      console.log("Successfuly connected to db...")
      console.log(`listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
