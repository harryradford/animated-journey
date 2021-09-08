// Import npm modules.
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Import local modules.
const User = require('../../src/models/user.js')
const Task = require('../../src/models/task.js')

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

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Harry',
    email: 'harry@example.com',
    password: 'testpass',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task one',
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task two',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three',
    owner: userTwoId
}

const prepareDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

// Close database connection.
const closeDatabaseConnection = async () => {
    await mongoose.disconnect()
}

// Module exports.
module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    prepareDatabase,
    closeDatabaseConnection
}
