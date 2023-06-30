const supertest = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const User = require('../../models/User')

const api = supertest(app)

beforeAll(async () => {
    await User.deleteMany({})
})
afterAll(async () => await mongoose.connection.close())

describe('User Routes', () => {
    const newUser = {
        username: "testuser1",
        password: "test123",
        fullname: "Test User"
    }
    test('should respond with home page', () => {
        return api.get('/')
            .then(res => {
                expect(res.statusCode).toBe(200)
                expect(res.text).toMatch(/welcome/i)
            })
    })

    test('should register a new user', () => {
        return api.post('/users/register')
            .send(newUser)
            .then(res => {
                expect(res.body).toBeDefined()
                expect(res.body.status).toMatch(/success/)
                expect(res.body.user.role).toBe('user')
            })
    })

    test('should not allow duplicate usernames', () => {
        return api.post('/users/register')
            .send(newUser)
            .then((res) => {
                expect(res.statusCode).toBe(400)
                expect(res.body.error).toMatch(/already registered/i)
            })
    })

    test('should not allow empty fields', () => {
        return api.post('/users/register')
            .send({})
            .then((res) => {
                expect(res.statusCode).toBe(400)
                expect(res.body.error).toMatch(/all fields are required/i)
            })
    })
})

