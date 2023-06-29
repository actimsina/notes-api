require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const userRouter = require('./routes/user_routes')
const errorHandler = require('./middlewares/errorHandler')

const db_uri = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI
    : process.env.DB_URI

mongoose.connect(db_uri)
    .then(() => console.log(`connected to ${db_uri} server`))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Notes App API server')
})

app.use('/users', userRouter)

app.use(errorHandler)

module.exports = app