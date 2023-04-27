const { register, login } = require('../services/authService')
const { body, validationResult } = require('express-validator')
const { parseOtherErrToExpressValidatorErr, parseErr } = require('../util.js/errorParser')

const router = require('express').Router()

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register',
    body(['username', 'password', 'rePassword']).trim(),
    body('username').isAlphanumeric().withMessage('The username must contain only english letters and/or numbers!'),
    body('password').isAlphanumeric().withMessage('The password must contain only english letters and/or numbers!')
        .isLength(5).withMessage('The password must be at least 5 characters long!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            if (req.body.password != req.body.rePassword) throw new Error('The passwords don\'t match!')
            const token = await register({
                username: req.body.username,
                password: req.body.password
            })
            res.cookie('token', token, { maxAge: 1400000 })
            if (errors.length > 0) throw errors
            res.redirect('/')
        } catch (error) {
            console.log(error);
            if (!Array.isArray(error)) errors.unshift(...parseOtherErrToExpressValidatorErr(error))
            res.render('register', {
                username: req.body.username,
                errorsObj: parseErr(errors)
            })
        }
    })

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    body(['username', 'password', 'rePassword']).trim(),
    async (req, res) => {
        try {
            const token = await login({
                username: req.body.username,
                password: req.body.password
            })
            res.cookie('token', token, { maxAge: 1400000 })
            res.redirect('/')
        } catch (error) {
            res.render('login', {
                username: req.body.username,
                errorsObj: parseErr(parseOtherErrToExpressValidatorErr(error))
            })
        }
    })

module.exports = router