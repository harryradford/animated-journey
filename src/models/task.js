// Import npm modules.
const mongoose = require('mongoose')

// Define the task schema.
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// Define the task model.
const Task = mongoose.model('Task', taskSchema)

// Module exports.
module.exports = Task
