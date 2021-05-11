const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        res.json({ user })
    } catch (error) {
        return res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})

router.put('/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (req.file) {
            user.avatar = req.file.path
        }
        user.save()
        res.json({ message: 'Фото изменено успешно' })
    } catch (error) {
        return res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
module.exports = router
