const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
    customer: { type: Types.ObjectId, required: true, ref: 'User' },
    price: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    order: [{ type: Types.ObjectId, required: true, ref: 'Event' }],
})

module.exports = model('Order', schema)
