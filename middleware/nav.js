module.exports = () => (req, res, next) => {
    res.locals.isUser = req.user || false
    if (res.locals.isUser) {
        res.locals.username = req.user.username
    }
    next()
}