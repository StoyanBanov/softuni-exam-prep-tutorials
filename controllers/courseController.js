const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { createCourse, getCourseById, enrollCourse, updateCourse, deleteCourse } = require('../services/courseService')
const { parseOtherErrToExpressValidatorErr, parseErr } = require('../util.js/errorParser')

router.get('/create', (req, res) => {
    res.render('create-course')
})

router.post('/create',
    body(['title', 'description', 'imageUrl', 'duration']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            await createCourse({
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                duration: req.body.duration,
                _ownerId: req.user._id
            })
            if (errors.length > 0) throw errors
            res.redirect('/')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            console.log(error);
            res.render('create-course', {
                course: req.body,
                errorsObj: parseErr(errors)
            })
        }
    })

router.get('/:id/edit', async (req, res) => {
    try {
        const course = await getCourseById(req.params.id)
        if (course._ownerId != req.user._id) throw new Error('You cannot edit a course you don\'t own!')
        res.render('edit-course', {
            course
        })
    } catch (error) {
        res.render('/')
    }
})

router.post('/:id/edit',
    body(['title', 'description', 'imageUrl', 'duration']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            const course = await getCourseById(req.params.id)
            if (course._ownerId != req.user._id) throw new Error('You cannot edit a course you don\'t own!')
            await updateCourse(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                duration: req.body.duration
            })
            if (errors.length > 0) throw errors
            res.redirect(`/course/${req.params.id}`)
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            console.log(error);
            res.render('edit-course', {
                course: Object.assign(req.body, { _id: req.params.id }),
                errorsObj: parseErr(errors)
            })
        }
    })

router.get('/:id/enroll', async (req, res) => {
    let course = false
    try {
        course = await getCourseById(req.params.id)
        course.isOwner = course._ownerId == req.user._id
        if (!course.isOwner) course.isEnrolled = course.usersEnrolled.map(u => u.toString()).includes(req.user._id)
        else throw new Error('You cannot enroll in your own courses!')
        if (course.isEnrolled) throw new Error('You have already enrolled to this course!')
        await enrollCourse(req.params.id, req.user._id)
        res.redirect(`/course/${course._id}`)
    } catch (error) {
        if (course)
            res.render('course-details', {
                course,
                errorsObj: parseErr(parseOtherErrToExpressValidatorErr(error))
            })
        else
            res.redirect('/')
    }
})

router.get('/:id/delete', async (req, res) => {
    try {
        const course = await getCourseById(req.params.id)
        if (course._ownerId != req.user._id) throw new Error('You cannot delete a course you don\'t own!')
        await deleteCourse(req.params.id)
        res.redirect('/')
    } catch (error) {
        if (course)
            res.render('course-details', {
                course,
                errorsObj: parseErr(parseOtherErrToExpressValidatorErr(error))
            })
        else
            res.redirect('/')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await getCourseById(req.params.id)
        course.isOwner = course._ownerId == req.user._id
        if (!course.isOwner) course.isEnrolled = course.usersEnrolled.map(u => u.toString()).includes(req.user._id)
        res.render('course-details', {
            course
        })
    } catch (error) {
        res.redirect('/')
    }
})

module.exports = router