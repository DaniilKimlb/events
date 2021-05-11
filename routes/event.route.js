const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Event = require('../models/Event')
const { body, validationResult } = require('express-validator')
const router = Router()

router.post(
    '/add',
    auth,
    [
        body('title', 'Некорректное название ')
            .isLength({ min: 3 })
            .isString()
            .exists(),
        body('price', 'Некорректная цена').isNumeric().exists(),
        body('description', 'Некорректное описание').exists(),
        body('dateStart', 'Неправильно указана дата').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message:
                        'Указаны некорректные данные при создании мероприятия',
                    error: errors.array(),
                })
            }
            const {
                title,
                price,
                description,
                dateStart,
                detailedDescription,
            } = req.body
            let img
            if (req.file) {
                img = req.file.path
            }
            const event = new Event({
                title,
                price,
                img,
                description,
                dateStart,
                creator: req.user.userId,
                detailedDescription,
            })
            await event.save()
            res.status(201).json({
                message: 'Мероприятие было создано',
            })
        } catch (error) {
            res.status(500).json({
                message: 'Что-то пошло не так',
            })
        }
    }
)

router.put('/change/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (req.user.status !== 'admin') {
            if (event.creator.toString() !== req.user.userId.toString()) {
                return res.status(400).json({ message: 'Изменение невозможно' })
            }
        }
        if (req.file) {
            event.img = req.file.path
        }
        delete req.body.img
        Object.assign(event, req.body)
        await event.save()
        res.status(201).json({ message: 'Мероприятие было изменено' })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.status === 'admin') {
            await Event.findOneAndDelete({ _id: req.params.id })
        } else {
            await Event.findOneAndDelete({
                _id: req.params.id,
                creator: req.user.userId,
            })
        }
        res.status(204).json({})
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('creator')
        res.json(event)
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.get('/', auth, async (req, res) => {
    try {
        const { page, count } = req.query
        const skipItems = page * count
        const countEvents = await Event.countDocuments()
        const events = await Event.find()
            .skip(skipItems)
            .limit(+count)
        await Event.deleteMany({ dateStart: { $lt: Date.now() } })
        res.json({
            events,
            count: Math.ceil(+countEvents / +count),
        })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.put('/rating', auth, async (req, res) => {
    try {
        const { rating, id } = req.body
        const event = await Event.findById(id)
        const rat = {
            user: req.user.userId,
            rating,
        }
        const idx = event.rating.appreciated.findIndex(
            (e) => e.user == req.user.userId
        )
        if (idx === -1) {
            event.rating.appreciated.push(rat)
        } else {
            event.rating.appreciated[idx].rating = rating
        }
        let averageRating
        if (event.rating.appreciated.length > 1) {
            averageRating = event.rating.appreciated.reduce((ac, r) => {
                return (ac + r.rating) / 2
            }, 0)
        } else {
            averageRating = rat.rating
        }
        event.rating.averageRating = averageRating

        await event.save()
        return res.status(201).json({ message: 'Рейтинг был изменен' })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
module.exports = router
