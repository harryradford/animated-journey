// Import npm modules.
const request = require('supertest')
const mongoose = require('mongoose')

// Import local modules.
const app = require('../src/app.js')
const Task = require('../src/models/task.js')
const {
    userOne,
    userTwo,
    taskOne,
    prepareDatabase,
    closeDatabaseConnection
} = require('./fixtures/db.js')

// Prepare the database before each test case.
beforeEach(prepareDatabase)

// Close database connection after all test cases.
afterAll(closeDatabaseConnection)

// Test task creation.
test('Should not create task with no description', async () => {
    await request(app)
        .post(`/tasks`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(400)
})

test('Should create task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Water the plants'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)

    expect(task).not.toBeNull()
    expect(task.owner).toEqual(mongoose.Types.ObjectId(userOne._id))
    expect(task.completed).toBe(false)
})

// Test getting tasks.
test('Should get a task by id that belongs to the user', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body._id.toString()).toBe(taskOne._id.toString())
})

test('Should only get tasks that belong to the user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

// Test deleting tasks.
test('Should not delete tasks if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)

    const task = await Task.findById(taskOne._id)
    
    expect(task).not.toBeNull()
})

test('Should not delete tasks that do not belong to the user', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    
    expect(task).not.toBeNull()
})

test('Should delete tasks that do belong to the user', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id)
    
    expect(task).toBeNull()
})

// Test updating tasks.
test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
})

test('Should not update tasks that do not belong to the user', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'Task one updated'
        })
        .expect(404)

    const task = await Task.findById(taskOne._id)

    expect(task.description).toBe('Task one')
})

test('Should update task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Task one updated'
        })
        .expect(200)

    const task = await Task.findById(taskOne._id)

    expect(task.description).toBe('Task one updated')
})
