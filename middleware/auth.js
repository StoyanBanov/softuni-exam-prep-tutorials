const { verifyToken } = require("../services/authService");

module.exports = () => (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        try {
            const user = verifyToken(token)
            req.user = user
        } catch (error) {
            console.log(error);
            res.clearCookie('token')
            res.redirect('/auth/login')
        }
    }
    next()
}