require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const userRouter = require('./routes/user_routes')
const errorHandler = require('./middlewares/error_handler')
const noteRouter = require('./routes/note_routes')

require('./config/db_config')

const app = express()

app.use(cors('*'))
app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Notes App API server')
})

app.use('/users', userRouter)
app.use('/notes', noteRouter)

app.use(errorHandler)

// unknown path
app.use((req, res) => {
    res.status(404).json({ error: 'path not found' })
})

module.exports = app
