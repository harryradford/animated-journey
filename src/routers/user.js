// Import npm modules.
import express from 'express'
import multer from 'multer'

// Import local modules.
import User from '../models/user.js'
import auth from '../middleware/auth.js'

// Create a new router.
const router = new express.Router()

// Create a user document.
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login with an existing account.
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// Logout the user.
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

// Logout the user from all sessions.
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send()
    } catch (error) {
        res.status(500).send(error)
    }
})

// Read the user profile.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Update the user document.
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['age', 'name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete the user document.
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Upload or update an avatar.
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'))
        }

        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()

    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// Delete the avatar.
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
    
        res.status(200).send()
    } catch (error) {
        res.send(500).send(error)
    }
})

// Read an avatar by user id.
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.status(200).send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

// Module exports.
export default router
