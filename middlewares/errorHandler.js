const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    res.statusCode = res.statusCode ? res.statusCode : 500
    res.json({ error: err.message })
}

module.exports = errorHandler 