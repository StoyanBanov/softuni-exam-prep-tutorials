const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const jwtSecret = 'my-secret'

async function register(userData) {
    userData.password = await bcrypt.hash(userData.password, 10)
    const newUser = await User.create(userData)
    token = createToken({
        _id: newUser._id,
        username: newUser.username
    })
    return token
}

async function login(userData) {
    const existingUser = await User.findOne({ username: userData.username })
    if (!existingUser || !(await bcrypt.compare(userData.password, existingUser.password))) throw new Error('Wrong username or password!')
    token = createToken({
        _id: existingUser._id,
        username: existingUser.username
    })
    return token
}

function verifyToken(token) {
    return jwt.verify(token, jwtSecret)
}

function createToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: '4h' })
}

module.exports = {
    register,
    login,
    verifyToken
}