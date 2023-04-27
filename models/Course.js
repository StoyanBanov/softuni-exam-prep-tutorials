const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    title: { type: String, required: true, unique: true, minLength: [4, 'The title cannot be less than 4 characters long!'] },
    description: { type: String, minLength: [20, 'The description cannot be less than 20 characters long!'], maxLength: [50, 'The description cannot be more than 50 characters long!'] },
    imageUrl: { type: String, required: true, math: [/^https?:\/\/.+$/i, 'The image URL must be real!'] },
    duration: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date().valueOf() },
    usersEnrolled: { type: [ObjectId], ref: 'User', default: [] },
    _ownerId: { type: ObjectId, required: true }
})

schema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const Course = model('Course', schema)

module.exports = Course