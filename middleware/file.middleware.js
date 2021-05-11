const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        cb(null, Date.now().toString() + '-' + file.originalname)
    },
})
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
module.exports = multer({
    storage,
    fileFilter,
})
