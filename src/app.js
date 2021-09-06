// Import npm modules.
const express = require('express')

// Import local modules.
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

// Run local modules.
require('./db/mongoose.js')

// Create the express application.
const app = express()

// Parse incoming JSON.
app.use(express.json())

// Register routers.
app.use(userRouter)
app.use(taskRouter)

// Module exports.
module.exports = app
