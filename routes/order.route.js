const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const Orders = require('../models/Order')
const router = Router()

router.post('/', auth, async (req, res) => {
    try {
        const { price, order } = req.body
        const orders = new Orders({ customer: req.user.userId, price, order })
        const user = await User.findById(req.user.userId)
        user.cart.items = {}
        await user.save()
        await orders.save()
        res.json({ message: 'Заказ сделан' })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Orders.find({ customer: req.user.userId })
            .populate('order', 'title')
            .exec()
        res.json({ orders })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})

router.get('/all', auth, async (req, res) => {
    try {
        const orders = await Orders.find()
            .populate('customer', 'firstName lastName email')
            .exec()
        res.json({ orders })
    } catch (error) {
        res.status(500).json({
            message: 'Что-то пошло не так',
        })
    }
})
module.exports = router
