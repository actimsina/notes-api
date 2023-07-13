const errorHandler = (err, req, res, next) => {
    console.error(err)
    res.statusCode = res.statusCode ? res.statusCode : 500
    if (err.name === 'ValidationError') res.statusCode = 400
    res.json({ error: err.message })
}

const errorHandler1 = (err, req, res, next) => {
    let statusCode = res.statusCode || 500
    let errMessage = err.message || 'Internal Server Error'

    console.error(err)
    res.status(statusCode).json({ error: errMessage })
}



module.exports = errorHandler1;
