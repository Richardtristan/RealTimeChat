
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}
const redirectChat = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/chat')
    } else {
        next()
    }
}

module.exports = {
    redirectLogin,
    redirectChat
}