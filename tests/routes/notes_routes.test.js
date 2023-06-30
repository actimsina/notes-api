const supertest = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const Note = require('../../models/Note')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

let token = null
beforeAll(async () => {
    await User.deleteMany()
    await Note.deleteMany()

    await api.post('/users/register')
        .send({
            username: 'testuser1',
            password: 'test123',
            fullname: 'test user'
        })

    const res = await api.post('/users/login')
        .send({
            username: 'testuser1',
            password: 'test123'
        })

    token = res.body.token
})

afterAll(async () => await mongoose.connection.close())

describe('Notes APIs', () => {
    test('should not allow to with authentication', () => {
        return api.get('/notes')
            .then((res) => {
                expect(res.statusCode).toBe(401)
                expect(res.body.error).toMatch(/auth token not present/i)
            })
    })
    test('should be able to create note', () => {
        return api.post('/notes')
            .set('authorization', `bearer ${token}`)
            .send({
                title: 'buy apples'
            })
            .then((res) => {
                expect(res.statusCode).toBe(201)
                expect(res.body.title).toMatch('buy apples')
                expect(res.body.user).toBeDefined()
            })
    })
})
