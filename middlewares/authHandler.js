const jwt = require('jsonwebtoken')

const verifyUser = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        res.status(401)
        return next(new Error('auth token not present'))
    }
    token = token.split(' ')[1]

    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) return next(err)
        req.user = payload
    })
    next()
}

const verifyAdmin = (req, res, next) => {
    if (req.user.role === 'admin') return next()
    res.status(403)
    next(new Error('you are not admin!'))
}
module.exports = { verifyUser, verifyAdmin }