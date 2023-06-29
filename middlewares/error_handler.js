const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    res.statusCode = res.statusCode ? res.statusCode : 500
    if (err.name === 'ValidationError') res.statusCode = 400
    res.json({ error: err.message })
}

module.exports = errorHandler 