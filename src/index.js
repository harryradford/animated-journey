// Import npm modules.
import express from 'express'

// Import local modules.
import userRouter from './routers/user.js'
import taskRouter from './routers/task.js'

// Run local modules.
import './db/mongoose.js'

// Create the express application.
const app = express()

// Get the port for Heroku or local development.
const port = process.env.PORT

// Parse incoming JSON.
app.use(express.json())

// Register routers.
app.use(userRouter)
app.use(taskRouter)

// Start listening for connections.
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
