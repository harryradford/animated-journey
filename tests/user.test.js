// Import npm modules.
const request = require('supertest')

// Import local modules.
const app = require('../src/app.js')
const User = require('../src/models/user.js')
const {userOneId, userOne, prepareDatabase, closeDatabaseConnection} = require('./fixtures/db.js')

// Prepare the database before each test case.
beforeEach(prepareDatabase)

// Close database connection after all test cases.
afterAll(closeDatabaseConnection)

// Test user registration.
test('Should not register user with existing email', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Harry',
            email: userOne.email,
            password: 'testpass'
        })
        .expect(400)
})

test('Should not register user with short password', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Harry',
            email: 'harry.radford@live.co.uk',
            password: 'test'
        })
        .expect(400)
})

test('Should register a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Harry',
            email: 'harry.radford@live.co.uk',
            password: 'testpass'
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()
    expect(user.password).not.toBe('testpass')
    expect(response.body).toMatchObject({
        user: {
            name: 'Harry',
            email: 'harry.radford@live.co.uk'
        },
        token: user.tokens[0].token
    })
})

// Test user authentication.
test('Should not login non-existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'maisie@example.com',
            password: 'testpass'
        })
        .expect(400)
})

test('Should not login user with incorrect password', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'wrongtestpass'
        })
        .expect(400)
})

test('Should login an existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneId)

    expect(response.body.token).toBe(user.tokens[1].token)
})
 
// Test getting a user profile.
test('Should not get user profile when unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should get user profile when authenticated', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// Test user account deletion.
test('Should not delete user account when unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Should delete user account when authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})

// Test uploading an avatar.
test('Should upload an avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)

    expect(user.avatar).toEqual(expect.any(Buffer))
})

// Test updating fields on user.
test('Should not update invalid fields on user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'United Kingdom'
        })
        .expect(400)
})

test('Should update valid fields on user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Arthur The Second'
        })
        .expect(200)

    const user = await User.findById(userOneId)

    expect(user.name).toBe('Arthur The Second')
})
