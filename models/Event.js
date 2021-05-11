const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
    title: { type: String, required: true },
    img: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    detailedDescription: { type: String },
    creator: { type: Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    dateStart: { type: Date, required: true },
    rating: {
        appreciated: [
            {
                user: Types.ObjectId,
                rating: Number,
            },
        ],
        averageRating: { type: Number, required: true, default: 0 },
    },
})

module.exports = model('Event', schema)
