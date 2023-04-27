const { hasUser } = require('../middleware/guards')
const { getAllCourses } = require('../services/courseService')

const router = require('express').Router()

router.get('/', async (req, res) => {
    let courses
    const search = req.query.search
    if (req.user) courses = await getAllCourses(undefined, search || '')
    else courses = await getAllCourses(3)
    courses.forEach(c => {
        (c.date = c.createdAt.toString().split(' ').splice(0, 5)).splice(3, 1)
        c.date = c.date.join(' ')
        c.enrolled = c.usersEnrolled.length
    })
    res.render(req.user ? 'user-home' : 'guest-home', {
        courses,
        search
    })
})

router.get('/logout', hasUser(), async (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = router