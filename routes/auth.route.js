const { Router } = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')

const router = Router()

router.post(
    '/registration',
    [
        body('firstName', 'Некорректное имя ')
            .isLength({ min: 3 })
            .isString()
            .exists(),
        body('lastName', 'Некорректная фамилия')
            .isLength({ min: 3 })
            .isString(),
        body('email', 'Некорректный email').isEmail(),
        body('password', 'Некорректный пароль')
            .isAlphanumeric()
            .isLength({ min: 6 })
            .exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: errors.array(),
                    message: 'Указаны некорректные данные при регистрации',
                })
            }
            const { firstName, lastName, email, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(422).json({
                    message: 'Такой пользователь уже существует',
                })
            }
            const hashPassword = await bcrypt.hash(password, 12)
            const auth = new User({
                email,
                password: hashPassword,
                firstName,
                lastName,
            })
            await auth.save()
            res.status(201).json({
                message: 'Пользователь создан',
            })
        } catch (error) {
            res.status(500).json({
                message: 'Что-то пошло не так',
            })
        }
    }
)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Неверный пароль или email' })
        }
        const pas = await bcrypt.compare(password, user.password)
        if (!pas) {
            return res
                .status(400)
                .json({ message: 'Неверный пароль или email' })
        }
        const token = jwt.sign(
            { userId: user.id, status: user.status },
            config.get('secrete-code-jwt'),
            { expiresIn: '1h' }
        )
        res.json({ token, userId: user.id, status: user.status })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})

module.exports = router
