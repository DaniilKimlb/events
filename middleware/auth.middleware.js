const jsw = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        const decode = jsw.verify(token, config.get('secrete-code-jwt'))
        req.user = decode
        next()
    } catch (error) {
        res.status(401).json({ message: 'Не авторизован' })
    }
}
