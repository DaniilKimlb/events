const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                eventId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Event',
                },
            },
        ],
    },
    status: { type: String, required: true, default: 'user' },
})
schema.methods.validFilter = function () {
    const items = [...this.cart.items]
    this.cart = { items: items.filter((e) => e.eventId) }
    return this.save()
}

schema.methods.removeItems = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex((c) => c.eventId.toString() === id.toString())
    if (items[idx].count === 1) {
        items = items.filter((e) => e.eventId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = { items }
    return this.save()
}

module.exports = model('User', schema)
