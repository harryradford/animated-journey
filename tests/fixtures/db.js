// Import npm modules.
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Import local modules.
const User = require('../../src/models/user.js')

// Prepare the database.
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Arthur',
    email: 'arthur@example.com',
    password: 'testpass',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const prepareDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

// Close database connection.
const closeDatabaseConnection = async () => {
    await mongoose.disconnect()
}

// Module exports.
module.exports = {
    userOneId,
    userOne,
    prepareDatabase,
    closeDatabaseConnection
}
