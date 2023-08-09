const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const { verifyUser } = require('../middlewares/auth_handler')
const User = require('../models/User')
const upload = require('../middlewares/img_upload')

const router = express.Router()

router.post('/register', (req, res, next) => {
    const { username, password, fullname } = req.body

    if (!username || !password || !fullname) {
        res.status(400)
        return next(Error("all fields are required"))
    }

    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                res.status(400)
                return next(new Error(`username ${username} already registered`))
            }
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return next(err)
                User.create({ username, password: hash, fullname })
                    .then((user) => {
                        res.status(201).json({ status: 'registration success', user })
                    }).catch(next)
            })
        }).catch(next)
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400)
        return next(new Error('all fields are required'))
    }
    User.findOne({ username })
        .then((user) => {
            if (!user) {
                res.status(404)
                return next(new Error('user is not registered'))
            }
            bcrypt.compare(req.body.password, user.password, (err, success) => {
                if (err) return next(err)
                if (!success) {
                    res.status(400)
                    return next(new Error('password does not match'))
                }
                const payload = {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role
                }
                jwt.sign(payload,
                    process.env.SECRET,
                    { expiresIn: '1d' },
                    (err, token) => {
                        if (err) return next(err)
                        res.json({ status: 'login success', token: token })
                    })
            })
        }).catch(next)
})

router.get('/profile', verifyUser, (req, res, next) => {
    User.findOne({ _id: req.user.id })
        .then((user) => {
            if (user) {
                res.json({ status: 'success', user })
            }
        }).catch(next)
})

router.put('/profile', verifyUser, (req, res, next) => {
    User.findOne({ _id: req.user.id })
        .then((user) => {
            if (user) {
                const { username, fullname, picture } = req.body
                user.username = username || user.username
                user.fullname = fullname || user.fullname
                user.picture = picture || user.picture
                user.save()
                    .then((user) => {
                        res.json({ status: 'update profile success', user })
                    }).catch(next)
            }
        }).catch(next)
})

router.post('/upload', verifyUser, upload.single('picture'), async (req, res, next) => {
    const { filename } = req.file
    console.log(req.file)
    await sharp(req.file.buffer)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(req.file.destination, 'resized', filename))

    fs.unlinkSync(req.file.path)

    res.json({ status: 'upload success', file: req.file })
})

module.exports = router