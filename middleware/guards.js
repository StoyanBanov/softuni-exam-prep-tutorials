function hasUser() {
    return (req, res, next) => {
        if (req.user) next()
        else res.redirect('/')
    }
}

function hasGuest() {
    return (req, res, next) => {
        if (req.user) res.redirect('/')
        else next()
    }
}

module.exports = {
    hasGuest,
    hasUser
}