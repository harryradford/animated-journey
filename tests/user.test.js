// Import npm modules.
const request = require('supertest')

// Import local modules.
const app = require('../src/app.js')

// Test if a new user is registered correctly.
test('Should register a new user', async () => {
    await request(app).post('/users').send({
        name: 'Harry',
        email: 'harry.radford@live.co.uk',
        password: 'testpass'
    }).expect(201)
})
