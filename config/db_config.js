const mongoose = require('mongoose')

const db_uri = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI
    : process.env.DB_URI


const connectDB = mongoose.connect(db_uri)
    .then(() => console.log(`connected to ${db_uri} server`))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

module.exports = connectDB