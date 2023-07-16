const multer = require('multer')
const uuid = require('uuid').v4

const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    }
    ,
    filename: (req, file, cb) => {
        // const ext = file.originalname.split('.').pop()
        const ext = path.extname(file.originalname.toLowerCase())
        cb(null, `${uuid()}${ext}`)
    }
})

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('only image files are allowed'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
})

module.exports = upload
