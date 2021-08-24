// Import npm modules.
import express from 'express'

// Import local modules.
import Task from '../models/task.js'
import auth from '../middleware/auth.js'

// Create a new router.
const router = new express.Router()

// Create a task document.
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()

        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Read all, complete, or incomplete task documents with pagination.
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()

        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Read a task document by id.
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update a task document by id.
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete a task document by id.
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Module exports.
export default router
