const { Router, response } = require('express')
const auth = require('../middleware/auth.middleware')
const Event = require('../models/Event')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

function mapCartItems(cart) {
    return cart.items.map((c) => ({
        ...c.eventId._doc,
        count: c.count,
    }))
}
function computePrice(event) {
    return event.reduce((acc, c) => {
        return (acc += c.price * c.count)
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        const uci = user.cart.items
        console.log(uci)
        const idx = uci.findIndex((e) => e.eventId == req.body.eventId)
        const cart = { count: 1, eventId: req.body.eventId }
        if (idx === -1) {
            uci.push(cart)
        } else {
            uci[idx].count++
        }
        await user.save()
        res.json({ message: 'Мероприятие добавлено в корзину' })
    } catch (error) {
        return res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('cart.items.eventId', 'count title price')
            .exec()
        await user.validFilter()
        const event = mapCartItems(user.cart)
        res.json({ event, price: computePrice(event) })
    } catch (error) {
        return res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
router.delete('/remove/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        await user.removeItems(req.params.id)
        res.json({ message: 'Удалено успешно' })
    } catch (error) {
        return res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
module.exports = router
