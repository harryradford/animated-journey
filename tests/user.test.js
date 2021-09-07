// Import npm modules.
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Import local modules.
const app = require('../src/app.js')
const User = require('../src/models/user.js')

// Prepare the database before each test case.
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

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

// Test user registration.
test('Should not register user with no name', async () => {
    await request(app).post('/users').send({
        email: 'harry.radford@live.co.uk',
        password: 'testpass'
    }).expect(400)
})

test('Should not register user with no email', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        password: 'testpass'
    }).expect(400)
})

test('Should not register user with no password', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: 'harry.radford@live.co.uk',
    }).expect(400)
})

test('Should not register user with existing email', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: userOne.email,
        password: 'testpass'
    }).expect(400)
})

test('Should not register user with short password', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: 'harry.radford@live.co.uk',
        password: 'test'
    }).expect(400)
})

test('Should not register user with weak password', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: 'harry.radford@live.co.uk',
        password: 'password'
    }).expect(400)
})

test('Should register a new user', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: 'harry.radford@live.co.uk',
        password: 'testpass'
    }).expect(201)
})

// Test user authentication.
test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'maisie@example.com',
        password: 'testpass'
    }).expect(400)
})

test('Should not login user with incorrect password', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'wrongtestpass'
    }).expect(400)
})

test('Should login an existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

// Test getting a user profile.
test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile when unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
