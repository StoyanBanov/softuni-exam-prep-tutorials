const homeController = require('../controllers/homeController')
const authController = require('../controllers/authController')
const courseController = require('../controllers/courseController')
const { hasGuest, hasUser } = require('../middleware/guards')

module.exports = app => {
    app.use(homeController)
    app.use('/auth', hasGuest(), authController)
    app.use('/course', hasUser(), courseController)
}