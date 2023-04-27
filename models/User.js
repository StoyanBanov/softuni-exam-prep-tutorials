const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, unique: true, minLength: [5, 'The username must be at least 5 characters long!'] },
    password: { type: String, required: true },
    enrolledCourses: { type: [ObjectId], ref: 'Course', default: [] }
})

schema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', schema)

module.exports = User