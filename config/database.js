const mongoose = require('mongoose')

const conn = 'mongodb://localhost:27017/softuni-tutorials'

module.exports = async app => {
    try {
        await mongoose.connect(conn, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('Database connected');
    } catch (error) {
        console.log('Error initializing database');
        console.error(error.message)
        process.exit(1)
    }
}