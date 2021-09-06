// Import local modules.
const app = require('./app.js')

// Get the port for Heroku or local development.
const port = process.env.PORT

// Start listening for connections.
app.listen(port, () => {
    console.log('Listening on port ' + port)
})
