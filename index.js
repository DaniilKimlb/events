const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const multer = require('./middleware/file.middleware')
const path = require('path')
const app = express()
const PORT = config.get('port') || 5000

app.use(multer.single('img'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/event', require('./routes/event.route'))
app.use('/api/cart', require('./routes/cart.route'))
app.use('/api/order', require('./routes/order.route'))
app.use('/api/profile', require('./routes/profile.route'))

async function start() {
    try {
        await mongoose.connect(config.get('connect-mongodb'), {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
        })
        app.listen(PORT, () => {
            console.log('The server is running on the port ' + PORT)
        })
    } catch (error) {
        console.log(`Server Error ${error.message}`)
        process.exit(1)
    }
}
start()
